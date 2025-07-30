"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, MapPin, Clock, Target, CheckCircle, ArrowRight } from "lucide-react"
import type { VoiceNote } from "@/types/speakback"

interface LearningStep {
  id: string
  noteId: string
  title: string
  subject: string
  difficulty: "beginner" | "intermediate" | "advanced"
  estimatedTime: number // minutes
  prerequisites: string[]
  isCompleted: boolean
  confidence: number // 0-1
  priority: "high" | "medium" | "low"
}

interface LearningPathScreenProps {
  voiceNotes: VoiceNote[]
  onBack: () => void
  onStudyNote: (note: VoiceNote) => void
}

export function LearningPathScreen({ voiceNotes, onBack, onStudyNote }: LearningPathScreenProps) {
  const [learningPath, setLearningPath] = useState<LearningStep[]>([])
  const [isGenerating, setIsGenerating] = useState(true)
  const [selectedSubject, setSelectedSubject] = useState<string>("all")

  useEffect(() => {
    generateLearningPath()
  }, [voiceNotes])

  const generateLearningPath = async () => {
    setIsGenerating(true)

    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Generate mock learning path
    const mainNotes = voiceNotes.filter((note) => !note.parentNoteId)

    const mockPath: LearningStep[] = mainNotes.map((note, index) => ({
      id: `step-${note.id}`,
      noteId: note.id,
      title: note.title,
      subject: note.subject,
      difficulty:
        note.completenessScore && note.completenessScore > 70
          ? "advanced"
          : note.completenessScore && note.completenessScore > 40
            ? "intermediate"
            : "beginner",
      estimatedTime: Math.floor((note.duration || 60000) / 60000) * 2 + 15, // 2x audio time + 15 min
      prerequisites: index > 0 ? [mainNotes[index - 1].id] : [],
      isCompleted: note.isComplete,
      confidence: (note.completenessScore || 50) / 100,
      priority:
        !note.nextReviewDate || note.nextReviewDate < new Date()
          ? "high"
          : note.nextReviewDate < new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
            ? "medium"
            : "low",
    }))

    // Sort by priority and prerequisites
    const sortedPath = mockPath.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    })

    setLearningPath(sortedPath)
    setIsGenerating(false)
  }

  const subjects = ["all", ...new Set(voiceNotes.map((note) => note.subject))]

  const filteredPath =
    selectedSubject === "all" ? learningPath : learningPath.filter((step) => step.subject === selectedSubject)

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800"
      case "intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "advanced":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  if (isGenerating) {
    return (
      <div className="min-h-full bg-gray-50">
        <div className="bg-white border-b border-gray-200 px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-xl font-semibold text-gray-900">Generating Learning Path</h1>
          </div>
        </div>

        <div className="p-4 flex items-center justify-center h-96">
          <Card className="w-full max-w-sm">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-blue-600 rounded-full flex items-center justify-center animate-pulse">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Creating Your Path</h3>
              <p className="text-sm text-gray-600">
                AI is analyzing your progress to recommend the optimal study sequence...
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const completedSteps = filteredPath.filter((step) => step.isCompleted).length
  const totalTime = filteredPath.reduce((sum, step) => sum + step.estimatedTime, 0)

  return (
    <div className="min-h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-900">Learning Path</h1>
        </div>
      </div>

      <div className="p-4 space-y-4 pb-8">
        {/* Progress Overview */}
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {completedSteps}/{filteredPath.length}
                </div>
                <div className="text-xs text-gray-600">Completed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {Math.floor(totalTime / 60)}h {totalTime % 60}m
                </div>
                <div className="text-xs text-gray-600">Est. Time</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round((completedSteps / filteredPath.length) * 100)}%
                </div>
                <div className="text-xs text-gray-600">Progress</div>
              </div>
            </div>

            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(completedSteps / filteredPath.length) * 100}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subject Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {subjects.map((subject) => (
            <Button
              key={subject}
              onClick={() => setSelectedSubject(subject)}
              variant={selectedSubject === subject ? "default" : "outline"}
              size="sm"
              className={`whitespace-nowrap ${selectedSubject === subject ? "bg-blue-600 text-white" : "bg-transparent"}`}
            >
              {subject === "all" ? "All Subjects" : subject}
            </Button>
          ))}
        </div>

        {/* Learning Steps */}
        <div className="space-y-3">
          {filteredPath.map((step, index) => {
            const note = voiceNotes.find((n) => n.id === step.noteId)
            if (!note) return null

            const isNext = !step.isCompleted && index === filteredPath.findIndex((s) => !s.isCompleted)

            return (
              <Card
                key={step.id}
                className={`${isNext ? "border-blue-300 bg-blue-50" : ""} ${step.isCompleted ? "opacity-75" : ""}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {/* Step Number/Status */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        step.isCompleted
                          ? "bg-green-600 text-white"
                          : isNext
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {step.isCompleted ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <span className="text-sm font-medium">{index + 1}</span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium text-gray-900">{step.title}</h3>
                        {isNext && <Badge className="bg-blue-600 text-white text-xs">Next</Badge>}
                      </div>

                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant="outline" className={getDifficultyColor(step.difficulty)}>
                          {step.difficulty}
                        </Badge>
                        <Badge variant="outline" className={getPriorityColor(step.priority)}>
                          {step.priority} priority
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Clock className="w-3 h-3 mr-1" />
                          {step.estimatedTime}min
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {Math.round(step.confidence * 100)}% confidence
                        </Badge>
                      </div>

                      {/* Prerequisites */}
                      {step.prerequisites.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs text-gray-500 mb-1">Prerequisites:</p>
                          <div className="flex flex-wrap gap-1">
                            {step.prerequisites.map((prereqId) => {
                              const prereqNote = voiceNotes.find((n) => n.id === prereqId)
                              const prereqStep = learningPath.find((s) => s.noteId === prereqId)
                              return prereqNote ? (
                                <Badge
                                  key={prereqId}
                                  variant="outline"
                                  className={`text-xs ${prereqStep?.isCompleted ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
                                >
                                  {prereqStep?.isCompleted ? "✓" : "○"} {prereqNote.title}
                                </Badge>
                              ) : null
                            })}
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button
                          onClick={() => onStudyNote(note)}
                          size="sm"
                          className={
                            step.isCompleted ? "bg-gray-600 hover:bg-gray-700" : "bg-blue-600 hover:bg-blue-700"
                          }
                        >
                          {step.isCompleted ? "Review" : "Study Now"}
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>

                        {step.priority === "high" && !step.isCompleted && (
                          <Badge className="bg-red-600 text-white text-xs px-2 py-1">Urgent</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* AI Recommendations */}
        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Target className="w-4 h-4" />
              AI Recommendations
            </h3>
            <div className="space-y-2 text-sm">
              <p className="text-gray-700">
                • Focus on {filteredPath.filter((s) => s.priority === "high" && !s.isCompleted).length} high-priority
                topics first
              </p>
              <p className="text-gray-700">• Estimated {Math.ceil(totalTime / 60)} hours to complete all topics</p>
              <p className="text-gray-700">• Best study time: 25-30 minutes per session</p>
              {filteredPath.some((s) => s.confidence < 0.6) && (
                <p className="text-gray-700">• Consider reviewing topics with low confidence before advancing</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
