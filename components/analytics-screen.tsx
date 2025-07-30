"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import type { VoiceNote } from "@/types/speakback"

interface AnalyticsScreenProps {
  voiceNotes: VoiceNote[]
  onBack: () => void
}

function countBySubject(notes: VoiceNote[]) {
  const count: Record<string, number> = {}
  for (const note of notes) {
    const tags = note.tags || []
    for (const tag of tags) {
      count[tag] = (count[tag] || 0) + 1
    }
  }
  return count
}

export function AnalyticsScreen({ voiceNotes, onBack }: AnalyticsScreenProps) {
  const [streak, setStreak] = useState(4) // Placeholder streak
  const [studyTime, setStudyTime] = useState(120) // minutes
  const subjectCounts = countBySubject(voiceNotes)

  return (
    <div className="p-6 space-y-6">
      <ArrowLeft className="mb-4 cursor-pointer" onClick={onBack} />
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-2">🔥 Study Streak</h2>
          <p className="text-gray-500 mb-4">You've studied for {streak} consecutive days.</p>
          <Progress value={(streak / 7) * 100} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-2">📈 Study Time</h2>
          <p className="text-gray-500 mb-4">Total time recorded: {studyTime} minutes</p>
          <Progress value={Math.min(studyTime, 300) / 3} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-2">📚 Subjects Breakdown</h2>
          {Object.entries(subjectCounts).map(([subject, count]) => (
            <div key={subject} className="mb-2">
              <p className="text-sm text-gray-700">{subject} ({count})</p>
              <Progress value={Math.min(count * 20, 100)} />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
