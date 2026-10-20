//
//  Models.swift
//  remote_control
//
//  What the deck (the perovskite web app) reports back to the phone.
//

import Foundation

nonisolated struct DeckState: Codable, Equatable, Sendable {
    var lessonId: String
    var lessonTitle: String
    var chapter: String
    var lessonIndex: Int
    var lessonCount: Int
    var step: Int
    var stepCount: Int
    var stepTitle: String
    var stepBody: String
    var stepMore: String
    var stepWhy: String
    var isStory: Bool
    var playing: Bool
    var explain: Bool
    var theme: String
    var locale: String
    var textScale: Double
    var autoRotate: Bool
    var navOpen: Bool
    var labels: Bool
    var slow: Bool
    var auto: Bool
    var presenting: Bool
    var photos: Bool
    var outline: [ChapterOutline]?
}

nonisolated struct ChapterOutline: Codable, Equatable, Identifiable, Sendable {
    var id: String
    var num: String
    var title: String
    var titleEn: String
    var lessons: [LessonOutline]
}

nonisolated struct LessonOutline: Codable, Equatable, Identifiable, Sendable {
    var id: String
    var title: String
    var titleEn: String
    var steps: Int
}

nonisolated struct RelayStatus: Codable, Equatable, Sendable {
    var deck: Bool
    var remotes: Int
}
