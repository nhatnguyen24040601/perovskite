//
//  ContentView.swift
//  remote_control
//
//  Created by Nguyen Ngoc Nhat on 20/10/26.
//

import SwiftUI

struct ContentView: View {
    @Environment(RemoteClient.self) private var client
    @State private var showSections = false
    @State private var showSettings = false
    @State private var timerStart = Date()

    var body: some View {
        VStack(spacing: 14) {
            header
            slideCard
            navButtons
            transport
            toggles
        }
        .padding(.horizontal, 16)
        .padding(.bottom, 8)
        .sheet(isPresented: $showSections) { SectionsView() }
        .sheet(isPresented: $showSettings) { SettingsView() }
        .onAppear { if client.baseURL == nil { showSettings = true } }
    }

    // MARK: Header

    private var header: some View {
        HStack(spacing: 10) {
            // Tap the status to force a reconnect.
            Button { client.start() } label: {
                HStack(spacing: 10) {
                    Circle().fill(statusColor).frame(width: 10, height: 10)
                    Text(statusText)
                        .font(.footnote)
                        .foregroundStyle(.secondary)
                        .lineLimit(1)
                }
            }
            .buttonStyle(.plain)
            Spacer()
            TimelineView(.periodic(from: .now, by: 1)) { context in
                let seconds = Int(context.date.timeIntervalSince(timerStart))
                Button { timerStart = Date() } label: {
                    Label(String(format: "%02d:%02d", seconds / 60, seconds % 60), systemImage: "timer")
                        .font(.footnote.monospacedDigit())
                }
                .buttonStyle(.bordered)
                .controlSize(.small)
            }
            Button { showSettings = true } label: { Image(systemName: "gearshape") }
                .buttonStyle(.bordered)
                .controlSize(.small)
        }
        .padding(.top, 4)
    }

    private var statusColor: Color {
        switch client.link {
        case .online(let deck): deck ? .green : .orange
        case .connecting, .idle: .gray
        case .failed: .red
        }
    }

    private var statusText: String {
        switch client.link {
        case .idle: "Not set up"
        case .connecting: "Connecting…"
        case .online(let deck): deck ? "Deck connected" : "Open the deck in the browser"
        case .failed(let message): message
        }
    }

    // MARK: Current slide

    private var slideCard: some View {
        VStack(alignment: .leading, spacing: 8) {
            if let s = client.state {
                Text(s.chapter.uppercased())
                    .font(.caption.weight(.semibold))
                    .foregroundStyle(.secondary)
                Text(s.lessonTitle)
                    .font(.title3.weight(.bold))
                stepIndicator(s)
                Divider()
                ScrollView {
                    VStack(alignment: .leading, spacing: 10) {
                        Text(s.stepTitle).font(.headline)
                        if !s.stepBody.isEmpty { Text(s.stepBody) }
                        if !s.stepMore.isEmpty { Text(s.stepMore).foregroundStyle(.secondary) }
                        if !s.stepWhy.isEmpty { Text(s.stepWhy).italic().foregroundStyle(.secondary) }
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                }
            } else {
                Spacer()
                Text("Waiting for the deck…")
                    .foregroundStyle(.secondary)
                    .frame(maxWidth: .infinity)
                Spacer()
            }
        }
        .padding(14)
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
        .background(.regularMaterial, in: RoundedRectangle(cornerRadius: 18, style: .continuous))
        .gesture(
            DragGesture(minimumDistance: 40).onEnded { drag in
                guard abs(drag.translation.width) > abs(drag.translation.height) * 1.5 else { return }
                press(drag.translation.width < 0 ? "next" : "prev")
            }
        )
    }

    private func stepIndicator(_ s: DeckState) -> some View {
        HStack {
            Menu {
                ForEach(0..<max(s.stepCount, 1), id: \.self) { index in
                    Button("Step \(index + 1)") { press("step", ["step": index]) }
                }
            } label: {
                Label("Step \(s.step + 1) / \(s.stepCount)", systemImage: "list.number")
                    .font(.subheadline.weight(.medium))
            }
            Spacer()
            Text("Slide \(s.lessonIndex + 1) / \(s.lessonCount)")
                .font(.caption)
                .foregroundStyle(.secondary)
        }
    }

    // MARK: Controls

    private var navButtons: some View {
        HStack(spacing: 12) {
            Button { press("prev") } label: {
                Image(systemName: "chevron.left").font(.title.weight(.bold))
                    .frame(maxWidth: .infinity, minHeight: 72)
            }
            .buttonStyle(.bordered)

            Button { press("next") } label: {
                Image(systemName: "chevron.right").font(.largeTitle.weight(.bold))
                    .frame(maxWidth: .infinity, minHeight: 72)
            }
            .buttonStyle(.borderedProminent)
            .layoutPriority(1)
        }
        .controlSize(.large)
    }

    private var transport: some View {
        HStack(spacing: 10) {
            iconButton("backward.end.fill") { press("prevLesson") }
            iconButton(client.state?.playing == true ? "pause.fill" : "play.fill") { press("togglePlay") }
            iconButton("arrow.counterclockwise") { press("replay") }
            iconButton("forward.end.fill") { press("nextLesson") }
            iconButton("list.bullet") { showSections = true }
        }
    }

    private var toggles: some View {
        let s = client.state
        return VStack(spacing: 10) {
            HStack(spacing: 10) {
                chip("Notes", "text.alignleft", on: s?.explain) { toggle("explain") }
                chip("Dark", "moon.fill", on: s?.theme == "dark") { toggle("theme") }
                chip("Present", "rectangle.expand.vertical", on: s?.presenting) { toggle("present") }
                chip(s?.locale == "en" ? "EN" : "VI", "globe", on: nil) {
                    press("locale", ["locale": s?.locale == "en" ? "vi" : "en"])
                }
            }
            HStack(spacing: 10) {
                chip("Spin", "rotate.3d", on: s?.autoRotate) { toggle("rotate") }
                chip("Labels", "tag", on: s?.labels, enabled: s?.isStory == true) { toggle("labels") }
                chip("Slow", "tortoise", on: s?.slow, enabled: s?.isStory == true) { toggle("slow") }
                chip("Auto", "forward.frame", on: s?.auto, enabled: s?.isStory == true) { toggle("auto") }
            }
            HStack(spacing: 10) {
                chip("Text −", "textformat.size.smaller", on: nil) { press("textScale", ["delta": -0.1]) }
                chip("Text +", "textformat.size.larger", on: nil) { press("textScale", ["delta": 0.1]) }
                chip("Photos", "photo", on: s?.photos) { toggle("photos") }
                chip("Menu", "sidebar.left", on: s?.navOpen) { toggle("nav") }
            }
        }
    }

    private func iconButton(_ symbol: String, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            Image(systemName: symbol).frame(maxWidth: .infinity, minHeight: 40)
        }
        .buttonStyle(.bordered)
    }

    private func chip(_ title: String, _ symbol: String, on: Bool?, enabled: Bool = true, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            VStack(spacing: 3) {
                Image(systemName: symbol).font(.body)
                Text(title).font(.caption2).lineLimit(1).minimumScaleFactor(0.8)
            }
            .frame(maxWidth: .infinity, minHeight: 44)
        }
        .buttonStyle(.bordered)
        .tint(on == true ? .accentColor : .gray)
        .disabled(!enabled)
    }

    // MARK: Sending

    private func toggle(_ key: String) { press("toggle", ["key": key]) }

    private func press(_ command: String, _ extra: [String: Any] = [:]) {
        UIImpactFeedbackGenerator(style: .light).impactOccurred()
        client.send(command, extra)
    }
}

#Preview {
    ContentView().environment(RemoteClient())
}
