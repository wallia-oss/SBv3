"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Clock, MessageCircle, Tag, X, Plus } from "lucide-react"
import type { VoiceNote } from "@/types/speakback"

interface FeedbackScreenProps {
  note: VoiceNote
  onBack: () => void
  onRerecordNow: () => void
  onRemindLater: () => void
  onNoteUpdated: (note: VoiceNote) => void
}

export function FeedbackScreen({ note, onBack, onRerecordNow, onRemindLater, onNoteUpdated }: FeedbackScreenProps) {
  const [tags, setTags] = useState<string[]>(note.tags || [])
  const [newTag, setNewTag] = useState("")
  const [isEditingTags, setIsEditingTags] = useState(false)

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBackground = (score: number) => {
    if (score >= 80) return "bg-green-100"
    if (score >= 60) return "bg-yellow-100"
    return "bg-red-100"
  }

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      const updatedTags = [...tags, newTag.trim()]
      setTags(updatedTags)
      setNewTag("")

      // Update the note
      const updatedNote = { ...note, tags: updatedTags }
      onNoteUpdated(updatedNote)
    }
  }

  const removeTag = (tagToRemove: string) => {
    const updatedTags = tags.filter((tag) => tag !== tagToRemove)
    setTags(updatedTags)

    // Update the note
    const updatedNote = { ...note, tags: updatedTags }
    onNoteUpdated(updatedNote)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addTag()
    }
  }

  return (
    <div className="min-h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-900">Review & Save</h1>
        </div>
      </div>

      <div className="p-4 space-y-6 pb-8">
        {/* Topic Info */}
        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">{note.title}</h2>
            <Badge variant="secondary" className="mb-3">
              {note.subject}
            </Badge>
            <p className="text-sm text-gray-600 leading-relaxed">{note.transcript}</p>
          </CardContent>
        </Card>

        {/* Completeness Score */}
        <Card>
          <CardContent className="p-6 text-center">
            <div
              className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center ${getScoreBackground(
                note.completenessScore || 0,
              )} mb-4`}
            >
              <div className={`text-2xl font-bold ${getScoreColor(note.completenessScore || 0)}`}>
                {note.completenessScore}%
              </div>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Completeness</h3>
            <p className="text-sm text-gray-600">
              {note.completenessScore && note.completenessScore >= 80
                ? "Great explanation! Your understanding seems comprehensive."
                : note.completenessScore && note.completenessScore >= 60
                  ? "Good start! There's room to expand on some concepts."
                  : "This is a foundation. Consider adding more detail and examples."}
            </p>
          </CardContent>
        </Card>

        {/* Tags Section */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Tags
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditingTags(!isEditingTags)}
                className="text-blue-600 hover:text-blue-700"
              >
                {isEditingTags ? "Done" : "Edit"}
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              {tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1 bg-blue-100 text-blue-800">
                  {tag}
                  {isEditingTags && (
                    <button onClick={() => removeTag(tag)} className="ml-1 hover:bg-blue-200 rounded-full p-0.5">
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </Badge>
              ))}
            </div>

            {isEditingTags && (
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Add a tag..."
                  className="flex-1 h-9 text-sm"
                />
                <Button onClick={addTag} size="sm" className="h-9 px-3 bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            )}

            <p className="text-xs text-gray-500 mt-2">
              AI suggested tags based on your content. You can edit or add more.
            </p>
          </CardContent>
        </Card>

        {/* AI Follow-up Question */}
        {note.aiPrompt && (
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <MessageCircle className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-blue-900 mb-2">AI Follow-up Question</h3>
                  <p className="text-blue-800 text-sm leading-relaxed">{note.aiPrompt}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button onClick={onRerecordNow} className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium">
            Re-record now
          </Button>

          <Button
            onClick={onRemindLater}
            variant="outline"
            className="w-full h-12 border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
          >
            <Clock className="w-4 h-4 mr-2" />
            Remind me later
          </Button>
        </div>
      </div>
    </div>
  )
}
