"use client"

import { useState } from "react"
import { IntroScreen } from "@/components/intro-screen"
import { LoginScreen } from "@/components/login-screen"
import { DashboardScreen } from "@/components/dashboard-screen"
import { RecordingScreen } from "@/components/recording-screen"
import { PlaybackScreen } from "@/components/playback-screen"
import { FeedbackScreen } from "@/components/feedback-screen"
import { RerecordOptionsScreen } from "@/components/rerecord-options-screen"
import { ReviewScreen } from "@/components/review-screen"
import { SettingsScreen } from "@/components/settings-screen"
import { SearchScreen } from "@/components/search-screen"
import { FlashcardScreen } from "@/components/flashcard-screen"
import { AnalyticsScreen } from "@/components/analytics-screen"
import { ConceptMapScreen } from "@/components/concept-map-screen"
import { LearningPathScreen } from "@/components/learning-path-screen"
import { VoiceAnalysisScreen } from "@/components/voice-analysis-screen"
import { EnhancedPlaybackScreen } from "@/components/enhanced-playback-screen"
import { EnhancedFlashcardScreen } from "@/components/enhanced-flashcard-screen"
import type { VoiceNote } from "@/types/speakback"
import { demoNotes } from "@/lib/demo-data"

export type Screen =
  | "intro"
  | "login"
  | "dashboard"
  | "recording"
  | "playback"
  | "feedback"
  | "rerecord-options"
  | "review"
  | "settings"
  | "search"
  | "flashcard"
  | "analytics"
  | "concept-map"
  | "learning-path"
  | "voice-analysis"
  | "enhanced-playback"
  | "enhanced-flashcard"

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("intro")
  const [voiceNotes, setVoiceNotes] = useState<VoiceNote[]>(demoNotes)
  const [currentNote, setCurrentNote] = useState<VoiceNote | null>(null)
  const [isDemo, setIsDemo] = useState(true)

  const navigateToScreen = (screen: Screen, note?: VoiceNote) => {
    if (note) {
      setCurrentNote(note)
    }
    setCurrentScreen(screen)
  }

  const addVoiceNote = (note: VoiceNote) => {
    setVoiceNotes((prev) => [note, ...prev])
  }

  const updateVoiceNote = (updatedNote: VoiceNote) => {
    setVoiceNotes((prev) => prev.map((note) => (note.id === updatedNote.id ? updatedNote : note)))
    setCurrentNote(updatedNote)
  }

  const deleteVoiceNote = (noteId: string) => {
    setVoiceNotes((prev) => prev.filter((note) => note.id !== noteId))
    if (currentNote?.id === noteId) {
      setCurrentNote(null)
    }
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case "intro":
        return <IntroScreen onNext={() => navigateToScreen("login")} />
      case "login":
        return <LoginScreen onLogin={() => navigateToScreen("dashboard")} />
      case "dashboard":
        return (
          <DashboardScreen
            voiceNotes={voiceNotes}
            onNavigate={navigateToScreen}
            onNoteSelect={setCurrentNote}
            isDemo={isDemo}
          />
        )
      case "recording":
        return (
          <RecordingScreen
            onBack={() => navigateToScreen("dashboard")}
            onRecordingComplete={(note) => {
              addVoiceNote(note)
              navigateToScreen("playback", note)
            }}
          />
        )
      case "playback":
        return (
          <PlaybackScreen
            note={currentNote}
            onBack={() => navigateToScreen("dashboard")}
            onNext={() => navigateToScreen("feedback")}
            onRerecord={() => navigateToScreen("rerecord-options")}
          />
        )
      case "feedback":
        return (
          <FeedbackScreen
            note={currentNote}
            onBack={() => navigateToScreen("playback")}
            onNext={() => navigateToScreen("dashboard")}
            onUpdateNote={updateVoiceNote}
          />
        )
      case "rerecord-options":
        return (
          <RerecordOptionsScreen
            note={currentNote}
            onBack={() => navigateToScreen("playback")}
            onRerecord={() => navigateToScreen("recording")}
            onKeepOriginal={() => navigateToScreen("feedback")}
          />
        )
      case "review":
        return (
          <ReviewScreen
            voiceNotes={voiceNotes}
            onBack={() => navigateToScreen("dashboard")}
            onNoteSelect={(note) => navigateToScreen("enhanced-playback", note)}
          />
        )
      case "settings":
        return <SettingsScreen onBack={() => navigateToScreen("dashboard")} />
      case "search":
        return (
          <SearchScreen
            voiceNotes={voiceNotes}
            onBack={() => navigateToScreen("dashboard")}
            onNoteSelect={(note) => navigateToScreen("enhanced-playback", note)}
          />
        )
      case "flashcard":
        return <FlashcardScreen voiceNotes={voiceNotes} onBack={() => navigateToScreen("dashboard")} />
      case "analytics":
        return <AnalyticsScreen voiceNotes={voiceNotes} onBack={() => navigateToScreen("dashboard")} />
      case "concept-map":
        return (
          <ConceptMapScreen
            voiceNotes={voiceNotes}
            onBack={() => navigateToScreen("dashboard")}
            onNoteSelect={(note) => navigateToScreen("enhanced-playback", note)}
          />
        )
      case "learning-path":
        return (
          <LearningPathScreen
            voiceNotes={voiceNotes}
            onBack={() => navigateToScreen("dashboard")}
            onNoteSelect={(note) => navigateToScreen("enhanced-playback", note)}
          />
        )
      case "voice-analysis":
        return <VoiceAnalysisScreen note={currentNote} onBack={() => navigateToScreen("dashboard")} />
      case "enhanced-playback":
        return (
          <EnhancedPlaybackScreen
            note={currentNote}
            onBack={() => navigateToScreen("dashboard")}
            onAnalyze={() => navigateToScreen("voice-analysis")}
          />
        )
      case "enhanced-flashcard":
        return <EnhancedFlashcardScreen voiceNotes={voiceNotes} onBack={() => navigateToScreen("dashboard")} />
      default:
        return (
          <DashboardScreen
            voiceNotes={voiceNotes}
            onNavigate={navigateToScreen}
            onNoteSelect={setCurrentNote}
            isDemo={isDemo}
          />
        )
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      {/* iPhone 15 Pro Frame */}
      <div className="relative">
        {/* iPhone Frame */}
        <div
          className="relative bg-black rounded-[60px] p-2"
          style={{
            width: "393px",
            height: "852px",
            boxShadow: "0 0 0 8px #1d1d1f, 0 0 0 12px #2d2d2f, 0 20px 40px rgba(0,0,0,0.4)",
          }}
        >
          {/* Screen */}
          <div
            className="relative bg-white rounded-[48px] overflow-hidden"
            style={{
              width: "377px",
              height: "836px",
            }}
          >
            {/* Dynamic Island */}
            <div
              className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-black rounded-full z-50"
              style={{
                width: "126px",
                height: "37px",
              }}
            />

            {/* Status Bar */}
            <div className="absolute top-0 left-0 right-0 h-12 flex items-center justify-between px-6 pt-3 z-40 text-black">
              <div className="text-sm font-semibold">9:41</div>
              <div className="flex items-center space-x-1">
                <div className="w-4 h-2 border border-black rounded-sm">
                  <div className="w-3 h-1 bg-black rounded-sm m-0.5"></div>
                </div>
                <div className="w-6 h-3 border border-black rounded-sm">
                  <div className="w-4 h-2 bg-black rounded-sm m-0.5"></div>
                </div>
              </div>
            </div>

            {/* App Content */}
            <div className="absolute inset-0 pt-12 pb-8">{renderScreen()}</div>

            {/* Home Indicator */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-black rounded-full opacity-60" />
          </div>
        </div>

        {/* Side Buttons */}
        <div className="absolute left-0 top-20 w-1 h-12 bg-gray-800 rounded-r-sm" />
        <div className="absolute left-0 top-36 w-1 h-16 bg-gray-800 rounded-r-sm" />
        <div className="absolute left-0 top-56 w-1 h-16 bg-gray-800 rounded-r-sm" />
        <div className="absolute right-0 top-48 w-1 h-20 bg-gray-800 rounded-l-sm" />
      </div>
    </div>
  )
}
