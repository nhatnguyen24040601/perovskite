//
//  remote_controlApp.swift
//  remote_control
//
//  Created by Nguyen Ngoc Nhat on 20/10/26.
//

import SwiftUI

@main
struct remote_controlApp: App {
    @State private var client = RemoteClient()
    @Environment(\.scenePhase) private var scenePhase

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environment(client)
                .onChange(of: scenePhase, initial: true) { _, phase in
                    // Keep the phone awake and the stream open only while the app is in front.
                    UIApplication.shared.isIdleTimerDisabled = phase == .active
                    if phase == .active { client.start() } else { client.stop() }
                }
        }
    }
}
