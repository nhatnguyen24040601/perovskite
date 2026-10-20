//
//  SectionsView.swift
//  remote_control
//
//  Jump straight to any slide of the deck.
//

import SwiftUI

struct SectionsView: View {
    @Environment(RemoteClient.self) private var client
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            ScrollViewReader { proxy in
                List {
                    ForEach(client.outline) { chapter in
                        Section("\(chapter.num) · \(chapter.title)") {
                            ForEach(chapter.lessons) { lesson in
                                Button {
                                    UIImpactFeedbackGenerator(style: .medium).impactOccurred()
                                    client.send("goto", ["lesson": lesson.id])
                                    dismiss()
                                } label: {
                                    HStack {
                                        Text(lesson.title).foregroundStyle(.primary)
                                        Spacer()
                                        if lesson.id == client.state?.lessonId {
                                            Image(systemName: "checkmark").foregroundStyle(.tint)
                                        }
                                    }
                                }
                                .id(lesson.id)
                            }
                        }
                    }
                }
                .onAppear {
                    if let id = client.state?.lessonId { proxy.scrollTo(id, anchor: .center) }
                }
            }
            .overlay {
                if client.outline.isEmpty {
                    ContentUnavailableView("No slides yet", systemImage: "rectangle.on.rectangle.slash",
                                           description: Text("Open the deck in the browser first."))
                }
            }
            .navigationTitle("Slides")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar { ToolbarItem(placement: .confirmationAction) { Button("Done") { dismiss() } } }
        }
        .presentationDetents([.medium, .large])
    }
}
