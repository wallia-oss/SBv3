"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, RefreshCcw, ArrowRight, ArrowLeftCircle } from "lucide-react"
import type { VoiceNote } from "@/types/speakback"

interface FlashcardScreenProps {
  voiceNotes: VoiceNote[]
  onBack: () => void
}

function extractFlashcards(note: VoiceNote) {
  if (!note.transcript) return []
  const parts = note.transcript.split(/[.?!]/).filter(line => line.trim().length > 10)
  return parts.map((line, idx) => ({
    question: `What does this mean?`,
    answer: line.trim(),
    id: `${note.id}-${idx}`
  }))
}

export function FlashcardScreen({ voiceNotes, onBack }: FlashcardScreenProps) {
  const allCards = voiceNotes.flatMap(extractFlashcards)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)

  useEffect(() => {
    setShowAnswer(false)
  }, [currentIndex])

  const card = allCards[currentIndex]

  const nextCard = () => setCurrentIndex((prev) => (prev + 1) % allCards.length)
  const prevCard = () => setCurrentIndex((prev) => (prev - 1 + allCards.length) % allCards.length)
  const shuffle = () => setCurrentIndex(Math.floor(Math.random() * allCards.length))

  if (!card) {
    return (
      <div className="p-6 text-center">
        <ArrowLeft className="mb-4 mx-auto cursor-pointer" onClick={onBack} />
        <h2 className="text-lg font-semibold">No flashcards available</h2>
        <p className="text-gray-500 mt-2">You need some transcripts first.</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <ArrowLeft className="mb-4 cursor-pointer" onClick={onBack} />
      <Card>
        <CardContent className="p-6 space-y-4 text-center">
          <p className="text-sm text-gray-400">Flashcard {currentIndex + 1} of {allCards.length}</p>
          <h3 className="text-xl font-semibold">{card.question}</h3>
          {showAnswer ? (
            <p className="mt-4 text-green-600">{card.answer}</p>
          ) : (
            <Button onClick={() => setShowAnswer(true)} className="mt-4">Show Answer</Button>
          )}

          <div className="flex justify-center gap-4 mt-6">
            <Button variant="outline" onClick={prevCard}><ArrowLeftCircle className="w-4 h-4 mr-2" />Prev</Button>
            <Button variant="outline" onClick={shuffle}><RefreshCcw className="w-4 h-4 mr-2" />Shuffle</Button>
            <Button variant="outline" onClick={nextCard}>Next<ArrowRight className="w-4 h-4 ml-2" /></Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
