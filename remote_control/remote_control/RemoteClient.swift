//
//  RemoteClient.swift
//  remote_control
//
//  Talks to the relay in the perovskite dev server:
//    GET  /__remote/events?role=remote   server-sent events: "state" and "status" (+ a ping every 15 s)
//    POST /__remote/cmd                  one JSON command per tap
//
//  A phone on Wi-Fi loses connections quietly (screen lock, roaming, a sleeping access point), so:
//    - the stream has a watchdog: no bytes for 20 s means it is dead and gets reopened,
//    - a network change reopens it at once,
//    - commands use a fresh connection and are retried; their `id` lets the server drop a duplicate.
//

import Foundation
import Network
import Observation
import UIKit

enum Link: Equatable {
    case idle
    case connecting
    /// Server reachable; `deck` says whether a browser tab with the deck is open.
    case online(deck: Bool)
    case failed(String)
}

@Observable
final class RemoteClient {
    var address: String {
        didSet { UserDefaults.standard.set(address, forKey: "address") }
    }
    var pin: String {
        didSet { UserDefaults.standard.set(pin, forKey: "pin") }
    }
    private(set) var link: Link = .idle
    private(set) var state: DeckState?
    private(set) var outline: [ChapterOutline] = []

    @ObservationIgnored private var loop: Task<Void, Never>?
    @ObservationIgnored private var lastActivity = Date()
    @ObservationIgnored private var wantsConnection = false
    @ObservationIgnored private var lastPath: NWPath.Status?
    @ObservationIgnored private let monitor = NWPathMonitor()

    /// The stream is long-lived; commands get their own session so a dead pooled socket never swallows a tap.
    @ObservationIgnored private let streamSession: URLSession = {
        let config = URLSessionConfiguration.ephemeral
        config.timeoutIntervalForRequest = 60
        config.waitsForConnectivity = false
        return URLSession(configuration: config)
    }()
    @ObservationIgnored private let commandSession: URLSession = {
        let config = URLSessionConfiguration.ephemeral
        config.httpAdditionalHeaders = ["Connection": "close"]
        config.waitsForConnectivity = false
        return URLSession(configuration: config)
    }()

    init() {
        address = UserDefaults.standard.string(forKey: "address") ?? ""
        pin = UserDefaults.standard.string(forKey: "pin") ?? ""
        monitor.pathUpdateHandler = { [weak self] path in
            Task { @MainActor in self?.pathChanged(path.status) }
        }
        monitor.start(queue: DispatchQueue(label: "remote.path"))
    }

    /// "10.0.0.5:8080", "mac.local" and "http://10.0.0.5:8080/" all work; the port defaults to 8080.
    var baseURL: URL? {
        var text = address.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !text.isEmpty else { return nil }
        if !text.contains("://") { text = "http://" + text }
        guard var parts = URLComponents(string: text), parts.host?.isEmpty == false else { return nil }
        if parts.port == nil { parts.port = 8080 }
        parts.path = ""
        parts.query = nil
        return parts.url
    }

    func start() {
        loop?.cancel()
        wantsConnection = baseURL != nil
        guard wantsConnection else {
            loop = nil
            link = .idle
            return
        }
        loop = Task { [weak self] in
            while !Task.isCancelled {
                await self?.runStream()
                if Task.isCancelled { break }
                try? await Task.sleep(for: .seconds(1.5))
            }
        }
    }

    func stop() {
        wantsConnection = false
        loop?.cancel()
        loop = nil
    }

    /// Wi-Fi came back or changed network: don't wait for the watchdog, reconnect now.
    private func pathChanged(_ status: NWPath.Status) {
        defer { lastPath = status }
        guard wantsConnection, status == .satisfied else { return }
        start()
    }

    func send(_ command: String, _ extra: [String: Any] = [:]) {
        guard let url = baseURL?.appending(path: "__remote/cmd") else { return }
        var request = URLRequest(url: url, timeoutInterval: 3)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "content-type")
        if !pin.isEmpty { request.setValue(pin, forHTTPHeaderField: "x-remote-pin") }
        let body: [String: Any] = ["cmd": command, "id": UUID().uuidString]
        request.httpBody = try? JSONSerialization.data(withJSONObject: extra.merging(body) { a, _ in a })

        Task { [weak self] in
            guard let self else { return }
            // Same id on every attempt: if an attempt did arrive but its reply was lost, the server ignores the repeat.
            for attempt in 1...3 {
                do {
                    let (_, response) = try await commandSession.data(for: request)
                    switch (response as? HTTPURLResponse)?.statusCode {
                    case 401:
                        link = .failed("Wrong PIN")
                    case 200:
                        if case .failed = link { start() }
                    default:
                        break
                    }
                    return
                } catch {
                    if attempt < 3 { try? await Task.sleep(for: .milliseconds(300)) }
                }
            }
            link = .failed("Can't reach the server")
            start()
        }
    }

    // MARK: Stream

    private func runStream() async {
        guard let url = baseURL?.appending(path: "__remote/events"),
              var parts = URLComponents(url: url, resolvingAgainstBaseURL: false) else { return }
        parts.queryItems = [URLQueryItem(name: "role", value: "remote")]
        guard let streamURL = parts.url else { return }

        var request = URLRequest(url: streamURL)
        request.setValue("text/event-stream", forHTTPHeaderField: "accept")
        if !pin.isEmpty { request.setValue(pin, forHTTPHeaderField: "x-remote-pin") }

        link = .connecting
        lastActivity = Date()
        let reader = Task { await readStream(request) }
        // The server pings every 15 s; 20 s of silence means the socket is dead even if iOS hasn't noticed.
        let watchdog = Task { [weak self] in
            while !Task.isCancelled {
                try? await Task.sleep(for: .seconds(5))
                guard let self else { return }
                if Date().timeIntervalSince(lastActivity) > 20 {
                    reader.cancel()
                    return
                }
            }
        }
        let failure = await withTaskCancellationHandler { await reader.value } onCancel: { reader.cancel() }
        watchdog.cancel()
        if !Task.isCancelled { link = .failed(failure) }
    }

    /// Reads until the stream ends or fails; returns why.
    private func readStream(_ request: URLRequest) async -> String {
        do {
            let (bytes, response) = try await streamSession.bytes(for: request)
            if let http = response as? HTTPURLResponse, http.statusCode != 200 {
                return http.statusCode == 401 ? "Wrong PIN" : "Server answered \(http.statusCode)"
            }
            lastActivity = Date()
            link = .online(deck: state != nil)
            var event = ""
            // `lines` skips blank lines, so each event is dispatched when its single data line arrives.
            for try await line in bytes.lines {
                lastActivity = Date()
                if line.hasPrefix("event:") {
                    event = line.dropFirst(6).trimmingCharacters(in: .whitespaces)
                } else if line.hasPrefix("data:") {
                    handle(event: event, data: Data(line.dropFirst(5).utf8))
                }
            }
            return "Connection closed"
        } catch {
            return "Connection lost, reconnecting…"
        }
    }

    private func handle(event: String, data: Data) {
        let decoder = JSONDecoder()
        switch event {
        case "state":
            guard var next = try? decoder.decode(DeckState.self, from: data) else { return }
            if let fresh = next.outline, !fresh.isEmpty { outline = fresh }
            next.outline = nil
            state = next
            link = .online(deck: true)
        case "status":
            if let status = try? decoder.decode(RelayStatus.self, from: data) {
                link = .online(deck: status.deck)
            }
        default:
            break
        }
    }
}
