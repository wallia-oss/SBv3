export interface VoiceNote {
  id: string
  title: string
  transcript: string
  audioBlob?: Blob
  audioUrl?: string
  duration: number
  createdAt: Date
  completenessScore: number
  feedback?: string
  tags?: string[]
  subject?: string
  difficulty?: "beginner" | "intermediate" | "advanced"
  keyPoints?: string[]
  questions?: string[]
  improvements?: string[]
  nextSteps?: string[]
}

export interface Flashcard {
  id: string
  question: string
  answer: string
  difficulty: number
  lastReviewed?: Date
  nextReview?: Date
  correctCount: number
  incorrectCount: number
  sourceNoteId: string
}

export type Screen =
  | "intro"
  | "login"
  | "dashboard"
  | "recording"
  | "playback"
  | "feedback"
  | "rerecord-options"
  | "review"
  | "flashcards"
  | "enhanced-flashcards"
  | "settings"
  | "search"
  | "analytics"
  | "concept-map"
  | "learning-path"
  | "voice-analysis"
  | "enhanced-playback"

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  preferences?: {
    theme: "light" | "dark"
    notifications: boolean
    autoTranscribe: boolean
  }
}

export interface StudySession {
  id: string
  noteId: string
  startTime: Date
  endTime?: Date
  score?: number
  completed: boolean
}
