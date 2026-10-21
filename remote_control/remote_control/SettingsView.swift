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
                    TextField("192.168.1.20:8080 or https://….trycloudflare.com", text: $client.address)
                        .keyboardType(.URL)
                        .textContentType(.URL)
                        .textInputAutocapitalization(.never)
                        .autocorrectionDisabled()
                    SecureField("PIN (optional)", text: $client.pin)
                        .keyboardType(.numbersAndPunctuation)
                } header: {
                    Text("Deck server")
                } footer: {
                    Text("On the same Wi-Fi: run `npm run dev` in the perovskite folder and enter the address printed as “[remote] iPhone app address”. On a different network: run `npm run dev:remote` and enter the https address and PIN it prints.")
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
