"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Play, Check } from "lucide-react"
import type { VoiceNote } from "@/types/speakback"

function getTodayISO() {
  return new Date().toISOString().split("T")[0]
}

function isDue(note: VoiceNote) {
  const today = new Date(getTodayISO())
  const due = new Date(note.nextReviewDate || note.date)
  return due <= today
}

function calculateNextReviewDate(difficulty: "easy" | "medium" | "hard", currentDate: string) {
  const base = new Date(currentDate)
  const offset = difficulty === "easy" ? 7 : difficulty === "medium" ? 3 : 1
  base.setDate(base.getDate() + offset)
  return base.toISOString().split("T")[0]
}

interface ReviewScreenProps {
  voiceNotes: VoiceNote[]
  onBack: () => void
  onPlayback: (note: VoiceNote) => void
  onReviewComplete: (note: VoiceNote, difficulty: "easy" | "medium" | "hard") => void
}

export function ReviewScreen({ voiceNotes, onBack, onPlayback, onReviewComplete }: ReviewScreenProps) {
  const dueNotes = voiceNotes.filter(isDue)
  const [currentIndex, setCurrentIndex] = useState(0)

  const currentNote = dueNotes[currentIndex]

  const handleReview = (difficulty: "easy" | "medium" | "hard") => {
    const updatedNote = {
      ...currentNote,
      nextReviewDate: calculateNextReviewDate(difficulty, getTodayISO())
    }
    onReviewComplete(updatedNote, difficulty)
    const next = currentIndex + 1
    if (next < dueNotes.length) {
      setCurrentIndex(next)
    } else {
      setCurrentIndex(-1)
    }
  }

  if (!dueNotes.length) {
    return (
      <div className="p-6 text-center">
        <ArrowLeft className="mb-4 mx-auto cursor-pointer" onClick={onBack} />
        <h2 className="text-xl font-semibold">🎉 No reviews due today</h2>
        <p className="text-gray-500 mt-2">You're all caught up.</p>
      </div>
    )
  }

  if (currentIndex === -1) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold">✅ All reviews completed</h2>
        <Button onClick={onBack} className="mt-4">Back to Dashboard</Button>
      </div>
    )
  }

  return (
    <div className="p-6">
      <ArrowLeft className="mb-4 cursor-pointer" onClick={onBack} />
      <Card>
        <CardContent className="space-y-4 p-6">
          <h3 className="text-lg font-bold">{currentNote.title || "Untitled Note"}</h3>
          <Badge variant="secondary">Due for review</Badge>
          <Button onClick={() => onPlayback(currentNote)} className="w-full mt-4">
            <Play className="mr-2 h-4 w-4" /> Play Voice Note
          </Button>
          <p className="text-sm text-gray-500 mt-2">How easy was this to recall?</p>
          <div className="flex gap-2 mt-2">
            <Button variant="outline" onClick={() => handleReview("easy")}>Easy</Button>
            <Button variant="outline" onClick={() => handleReview("medium")}>Medium</Button>
            <Button variant="outline" onClick={() => handleReview("hard")}>Hard</Button>
          </div>
          <p className="text-xs text-gray-400 mt-4">Reviewed {getTodayISO()}</p>
        </CardContent>
      </Card>
    </div>
  )
}
