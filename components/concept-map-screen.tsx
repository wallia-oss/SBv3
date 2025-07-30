"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, GitBranch, Zap, TrendingUp } from "lucide-react"
import type { VoiceNote } from "@/types/speakback"

interface ConceptNode {
  id: string
  title: string
  subject: string
  x: number
  y: number
  connections: string[]
  strength: number // 0-1, how well understood
}

interface ConceptMapScreenProps {
  voiceNotes: VoiceNote[]
  onBack: () => void
  onNoteSelect: (note: VoiceNote) => void
}

export function ConceptMapScreen({ voiceNotes, onBack, onNoteSelect }: ConceptMapScreenProps) {
  const [concepts, setConcepts] = useState<ConceptNode[]>([])
  const [selectedConcept, setSelectedConcept] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(true)

  useEffect(() => {
    generateConceptMap()
  }, [voiceNotes])

  const generateConceptMap = async () => {
    setIsGenerating(true)

    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Generate mock concept map based on notes
    const mockConcepts: ConceptNode[] = voiceNotes
      .filter((note) => !note.parentNoteId)
      .map((note, index) => ({
        id: note.id,
        title: note.title,
        subject: note.subject,
        x: 50 + (index % 3) * 100,
        y: 50 + Math.floor(index / 3) * 80,
        connections: [], // Will be populated below
        strength: (note.completenessScore || 50) / 100,
      }))

    // Create connections based on subject similarity
    mockConcepts.forEach((concept) => {
      const related = mockConcepts.filter(
        (other) =>
          other.id !== concept.id &&
          (other.subject === concept.subject ||
            concept.title.toLowerCase().includes(other.title.toLowerCase().split(" ")[0])),
      )
      concept.connections = related.slice(0, 2).map((r) => r.id)
    })

    setConcepts(mockConcepts)
    setIsGenerating(false)
  }

  const getStrengthColor = (strength: number) => {
    if (strength >= 0.8) return "bg-green-500"
    if (strength >= 0.6) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getStrengthText = (strength: number) => {
    if (strength >= 0.8) return "Strong"
    if (strength >= 0.6) return "Moderate"
    return "Weak"
  }

  if (isGenerating) {
    return (
      <div className="min-h-full bg-gray-50">
        <div className="bg-white border-b border-gray-200 px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-xl font-semibold text-gray-900">Generating Concept Map</h1>
          </div>
        </div>

        <div className="p-4 flex items-center justify-center h-96">
          <Card className="w-full max-w-sm">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-purple-600 rounded-full flex items-center justify-center animate-pulse">
                <GitBranch className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Mapping Connections</h3>
              <p className="text-sm text-gray-600">AI is analyzing relationships between your topics...</p>
            </CardContent>
          </Card>
        </div>
      </div>
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
          <h1 className="text-xl font-semibold text-gray-900">Concept Map</h1>
        </div>
      </div>

      <div className="p-4 space-y-4 pb-8">
        {/* Legend */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Understanding Levels</h3>
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Strong (80%+)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span>Moderate (60-79%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Weak (&lt;60%)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Concept Map */}
        <Card>
          <CardContent className="p-4">
            <div className="relative h-96 bg-gray-50 rounded-lg overflow-hidden">
              <svg className="absolute inset-0 w-full h-full">
                {/* Draw connections */}
                {concepts.map((concept) =>
                  concept.connections.map((connectionId) => {
                    const target = concepts.find((c) => c.id === connectionId)
                    if (!target) return null

                    return (
                      <line
                        key={`${concept.id}-${connectionId}`}
                        x1={concept.x}
                        y1={concept.y}
                        x2={target.x}
                        y2={target.y}
                        stroke="#e5e7eb"
                        strokeWidth="2"
                        strokeDasharray="5,5"
                      />
                    )
                  }),
                )}
              </svg>

              {/* Concept Nodes */}
              {concepts.map((concept) => {
                const note = voiceNotes.find((n) => n.id === concept.id)
                if (!note) return null

                return (
                  <div
                    key={concept.id}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all ${
                      selectedConcept === concept.id ? "scale-110 z-10" : "hover:scale-105"
                    }`}
                    style={{ left: concept.x, top: concept.y }}
                    onClick={() => setSelectedConcept(selectedConcept === concept.id ? null : concept.id)}
                  >
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-xs font-medium ${getStrengthColor(concept.strength)}`}
                    >
                      <div className="text-center">
                        <div className="text-xs font-bold">{Math.round(concept.strength * 100)}%</div>
                      </div>
                    </div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 text-xs text-center max-w-20">
                      <div className="font-medium text-gray-900 truncate">{concept.title}</div>
                      <div className="text-gray-500 text-xs">{concept.subject}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Selected Concept Details */}
        {selectedConcept && (
          <Card className="border-purple-200 bg-purple-50">
            <CardContent className="p-4">
              {(() => {
                const concept = concepts.find((c) => c.id === selectedConcept)
                const note = voiceNotes.find((n) => n.id === selectedConcept)
                if (!concept || !note) return null

                return (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">{concept.title}</h3>
                      <Badge variant="outline" className={`${getStrengthColor(concept.strength)} text-white`}>
                        {getStrengthText(concept.strength)}
                      </Badge>
                    </div>

                    <p className="text-sm text-gray-600 mb-3">
                      {note.transcript?.substring(0, 150) + "..." || "No transcript available"}
                    </p>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => onNoteSelect(note)}
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        Study This Topic
                      </Button>

                      {concept.strength < 0.7 && (
                        <Button size="sm" variant="outline" className="bg-transparent">
                          <Zap className="w-3 h-3 mr-1" />
                          Practice More
                        </Button>
                      )}
                    </div>

                    {concept.connections.length > 0 && (
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-xs text-gray-500 mb-2">Connected Topics:</p>
                        <div className="flex flex-wrap gap-1">
                          {concept.connections.map((connId) => {
                            const connectedNote = voiceNotes.find((n) => n.id === connId)
                            return connectedNote ? (
                              <Badge key={connId} variant="outline" className="text-xs">
                                {connectedNote.title}
                              </Badge>
                            ) : null
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })()}
            </CardContent>
          </Card>
        )}

        {/* AI Insights */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              AI Insights
            </h3>
            <div className="space-y-2 text-sm">
              <p className="text-gray-700">
                • You have strong understanding in {concepts.filter((c) => c.strength >= 0.8).length} topics
              </p>
              <p className="text-gray-700">
                • {concepts.filter((c) => c.strength < 0.6).length} topics need more practice
              </p>
              <p className="text-gray-700">
                • Most connected subject:{" "}
                {Object.entries(
                  concepts.reduce(
                    (acc, c) => {
                      acc[c.subject] = (acc[c.subject] || 0) + 1
                      return acc
                    },
                    {} as Record<string, number>,
                  ),
                ).sort(([, a], [, b]) => b - a)[0]?.[0] || "None"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
