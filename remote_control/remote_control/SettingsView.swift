//
//  SettingsView.swift
//  remote_control
//

import SwiftUI

struct SettingsView: View {
    @Environment(RemoteClient.self) private var client
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        @Bindable var client = client
        NavigationStack {
            Form {
                Section {
                    TextField("192.168.1.20:8080", text: $client.address)
                        .keyboardType(.URL)
                        .textContentType(.URL)
                        .textInputAutocapitalization(.never)
                        .autocorrectionDisabled()
                    SecureField("PIN (optional)", text: $client.pin)
                        .keyboardType(.numbersAndPunctuation)
                } header: {
                    Text("Deck server")
                } footer: {
                    Text("Start the deck on your Mac with `npm run dev` in the perovskite folder. The terminal prints the address as “[remote] iPhone app address”. Your phone and Mac must be on the same Wi-Fi. For a PIN, start with `REMOTE_PIN=1234 npm run dev`.")
                }
            }
            .navigationTitle("Connection")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .confirmationAction) {
                    Button("Connect") {
                        client.start()
                        dismiss()
                    }
                    .disabled(client.baseURL == nil)
                }
            }
        }
        .presentationDetents([.medium])
    }
}
