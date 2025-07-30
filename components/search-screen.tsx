"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Search, Play, Clock, CheckCircle, AlertCircle } from "lucide-react"
import type { VoiceNote } from "@/types/speakback"

interface SearchScreenProps {
  voiceNotes: VoiceNote[]
  onBack: () => void
  onPlayback: (note: VoiceNote) => void
}

export function SearchScreen({ voiceNotes, onBack, onPlayback }: SearchScreenProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim()) return []

    const query = searchQuery.toLowerCase()
    return voiceNotes.filter((note) => {
      // Don't show Part 2 notes separately in search
      if (note.parentNoteId) return false

      return (
        note.title.toLowerCase().includes(query) ||
        note.subject.toLowerCase().includes(query) ||
        note.transcript?.toLowerCase().includes(query) ||
        note.tags.some((tag) => tag.toLowerCase().includes(query))
      )
    })
  }, [voiceNotes, searchQuery])

  const getStatusIcon = (note: VoiceNote) => {
    if (note.isComplete) return <CheckCircle className="w-4 h-4 text-green-500" />
    if (note.nextReviewDate && note.nextReviewDate < new Date()) return <AlertCircle className="w-4 h-4 text-red-500" />
    return <Clock className="w-4 h-4 text-yellow-500" />
  }

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text

    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi")
    const parts = text.split(regex)

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      ),
    )
  }

  return (
    <div className="min-h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-900">Search Notes</h1>
        </div>
      </div>

      <div className="p-4 space-y-4 pb-8">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search titles, subjects, transcripts, or tags..."
            className="pl-10 h-12"
            autoFocus
          />
        </div>

        {/* Results */}
        {searchQuery.trim() && (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              {filteredNotes.length} result{filteredNotes.length !== 1 ? "s" : ""} for "{searchQuery}"
            </p>

            {filteredNotes.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-gray-500">No notes found matching your search.</p>
                </CardContent>
              </Card>
            ) : (
              filteredNotes.map((note) => (
                <Card key={note.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {getStatusIcon(note)}
                          <h3 className="font-medium text-gray-900">{highlightText(note.title, searchQuery)}</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{highlightText(note.subject, searchQuery)}</p>

                        {/* Show transcript excerpt if it matches */}
                        {note.transcript && note.transcript.toLowerCase().includes(searchQuery.toLowerCase()) && (
                          <div className="mb-2 p-2 bg-gray-50 rounded text-xs">
                            <p className="text-gray-700 line-clamp-2">
                              {highlightText(
                                note.transcript.length > 150
                                  ? note.transcript.substring(0, 150) + "..."
                                  : note.transcript,
                                searchQuery,
                              )}
                            </p>
                          </div>
                        )}

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 mb-2">
                          {note.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {highlightText(tag, searchQuery)}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center gap-2">
                          {note.completenessScore && (
                            <Badge variant="outline" className="text-xs">
                              {note.completenessScore}%
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-xs">
                            v{note.version}
                          </Badge>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onPlayback(note)}
                        className="ml-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Play className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Search Tips */}
        {!searchQuery.trim() && (
          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium text-gray-900 mb-2">Search Tips</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Search by title, subject, or content</li>
                <li>• Use tags to find related topics</li>
                <li>• Search transcripts to find specific concepts</li>
                <li>• Results highlight matching text</li>
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
