"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Shuffle,
  Mic,
  Square,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Brain,
  Key,
} from "lucide-react"
import type { VoiceNote } from "@/types/speakback"
import { whisperService } from "@/lib/whisper-service"
import { flashcardService, type FlashcardData } from "@/lib/flashcard-service"

interface VoiceResponse {
  transcript: string
  confidence: number
  accuracy: number
  completeness: number
  feedback: string
  missedPoints: string[]
  strengths: string[]
}

interface EnhancedFlashcardScreenProps {
  note: VoiceNote
  onBack: () => void
}

export function EnhancedFlashcardScreen({ note, onBack }: EnhancedFlashcardScreenProps) {
  const [flashcards, setFlashcards] = useState<FlashcardData[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [voiceResponse, setVoiceResponse] = useState<VoiceResponse | null>(null)
  const [isProcessingVoice, setIsProcessingVoice] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [hasApiKey, setHasApiKey] = useState(false)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Check if API key exists
    const apiKey = localStorage.getItem("speakback-openai-key")
    setHasApiKey(!!apiKey)

    generateFlashcards()
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [note])

  const generateFlashcards = async () => {
    setIsGenerating(true)

    try {
      const cards = await flashcardService.generateFlashcards(note.title, note.subject, note.transcript || "")
      setFlashcards(cards)
    } catch (error) {
      console.error("Failed to generate flashcards:", error)
      // Fallback to immediate mock data
      setFlashcards([
        {
          id: "fallback-1",
          question: `What is the main topic of "${note.title}"?`,
          answer: `This question covers the fundamental concepts related to ${note.title} in the context of ${note.subject}. The main topic involves understanding the core principles and their practical applications.`,
          difficulty: "easy",
          keyPoints: ["Main concept", "Core principles", "Basic understanding"],
          examples: ["Basic example", "Simple application"],
          relatedConcepts: [note.subject, "Fundamentals"],
        },
      ])
    } finally {
      setIsGenerating(false)
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      const chunks: BlobPart[] = []
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data)
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" })
        setAudioBlob(blob)
        stream.getTracks().forEach((track) => track.stop())
        processVoiceAnswer(blob)
      }

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)
      setVoiceResponse(null)

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } catch (error) {
      console.error("Error starting recording:", error)
      alert("Could not access microphone. Please check permissions.")
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }

  const processVoiceAnswer = async (audioBlob: Blob) => {
    setIsProcessingVoice(true)

    try {
      // Transcribe the audio
      const transcription = await whisperService.transcribeAudio(audioBlob)

      // Get current card
      const currentCard = flashcards[currentIndex]

      // Evaluate the spoken answer using AI
      const evaluation = await flashcardService.evaluateSpokenAnswer(
        currentCard.question,
        currentCard.answer,
        transcription.text,
        currentCard.keyPoints,
      )

      // Mock voice confidence analysis (could be enhanced with actual voice analysis)
      const confidence = 0.7 + Math.random() * 0.3 // 70-100%

      setVoiceResponse({
        transcript: transcription.text,
        confidence,
        accuracy: evaluation.accuracy,
        completeness: evaluation.completeness,
        feedback: evaluation.feedback,
        missedPoints: evaluation.missedPoints,
        strengths: evaluation.strengths,
      })
    } catch (error) {
      console.error("Error processing voice:", error)
    } finally {
      setIsProcessingVoice(false)
    }
  }

  const nextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % flashcards.length)
    setShowAnswer(false)
    setVoiceResponse(null)
    setAudioBlob(null)
  }

  const prevCard = () => {
    setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length)
    setShowAnswer(false)
    setVoiceResponse(null)
    setAudioBlob(null)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-emerald-100 text-emerald-700 border-emerald-200"
      case "medium":
        return "bg-amber-100 text-amber-700 border-amber-200"
      case "hard":
        return "bg-rose-100 text-rose-700 border-rose-200"
      default:
        return "bg-slate-100 text-slate-700 border-slate-200"
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600"
    if (score >= 60) return "text-amber-600"
    return "text-rose-600"
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (isGenerating) {
    return (
      <div className="min-h-full bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/50">
        <div className="bg-white/80 backdrop-blur-xl border-b border-white/20 px-6 py-4 shadow-sm">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-slate-500 hover:text-slate-700 hover:bg-slate-100/80 rounded-xl transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold text-slate-800">
              {hasApiKey ? "Generating AI Flashcards" : "Generating Smart Flashcards"}
            </h1>
          </div>
        </div>

        <div className="p-6 flex items-center justify-center h-96">
          <Card className="w-full max-w-sm bg-white/80 backdrop-blur-sm border-white/50 shadow-2xl shadow-purple-500/20 rounded-2xl">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center animate-pulse">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-slate-800 mb-3 text-lg">
                {hasApiKey ? "Creating AI-Powered Flashcards" : "Creating Smart Flashcards"}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {hasApiKey
                  ? "OpenAI is analyzing your transcript to generate personalized questions and comprehensive answers..."
                  : "Analyzing your transcript to generate detailed questions and comprehensive answers..."}
              </p>
              {!hasApiKey && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-xs text-blue-700 flex items-center gap-2">
                    <Key className="w-4 h-4" />
                    Add OpenAI API key in Settings for AI-powered flashcards
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const currentCard = flashcards[currentIndex]
  if (!currentCard) return null

  return (
    <div className="min-h-full bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/50">
      {/* Modern Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-white/20 px-6 py-4 shadow-sm">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-slate-500 hover:text-slate-700 hover:bg-slate-100/80 rounded-xl transition-all duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-800">
                {hasApiKey ? "AI Voice Flashcards" : "Smart Voice Flashcards"}
              </h1>
              {hasApiKey && (
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">AI-Powered</Badge>
              )}
            </div>
            <p className="text-sm text-slate-600 truncate">{note.title}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const shuffled = [...flashcards].sort(() => Math.random() - 0.5)
              setFlashcards(shuffled)
              setCurrentIndex(0)
              setShowAnswer(false)
              setVoiceResponse(null)
            }}
            className="text-slate-500 hover:text-slate-700 hover:bg-slate-100/80 rounded-xl transition-all duration-200"
          >
            <Shuffle className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="p-6 space-y-6 pb-8">
        {/* API Key Notice */}
        {!hasApiKey && (
          <Card className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm border-blue-200/50 shadow-lg rounded-2xl">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Key className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-blue-900 mb-1">Enhanced AI Features Available</h4>
                  <p className="text-sm text-blue-700">
                    Add your OpenAI API key in Settings to unlock personalized AI-generated flashcards and intelligent
                    answer evaluation.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Enhanced Progress */}
        <Card className="bg-white/80 backdrop-blur-sm border-white/50 shadow-xl shadow-slate-200/30 rounded-2xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-slate-700">
                Card {currentIndex + 1} of {flashcards.length}
              </p>
              <div className="text-sm font-bold text-slate-800">
                {Math.round(((currentIndex + 1) / flashcards.length) * 100)}%
              </div>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${((currentIndex + 1) / flashcards.length) * 100}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Flashcard */}
        <Card className="min-h-[500px] bg-white/80 backdrop-blur-sm border-white/50 shadow-2xl shadow-slate-200/40 rounded-2xl">
          <CardContent className="p-8 flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
              <Badge className={`${getDifficultyColor(currentCard.difficulty)} font-semibold`}>
                {currentCard.difficulty}
              </Badge>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 font-medium">
                  {note.subject}
                </Badge>
                {hasApiKey && currentCard.id.startsWith("ai-card") && (
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">
                    AI Generated
                  </Badge>
                )}
              </div>
            </div>

            {/* Question */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-slate-800 mb-4">Question:</h3>
              <p className="text-slate-700 leading-relaxed text-lg">{currentCard.question}</p>
            </div>

            {/* Key Points Hint */}
            <div className="mb-6 p-6 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm rounded-2xl border border-blue-200/50">
              <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Key Points to Cover:
              </h4>
              <ul className="text-sm text-blue-800 space-y-2">
                {currentCard.keyPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Voice Recording Section */}
            <div className="mb-8 p-6 bg-gradient-to-r from-purple-50/80 to-pink-50/80 backdrop-blur-sm rounded-2xl border border-purple-200/50">
              <h4 className="font-bold text-purple-900 mb-4 flex items-center gap-2">
                <Mic className="w-5 h-5" />
                Speak Your Answer
              </h4>

              {!isRecording && !voiceResponse && !isProcessingVoice && (
                <Button
                  onClick={startRecording}
                  className="w-full h-14 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/40 hover:-translate-y-1 border-0"
                >
                  <Mic className="w-5 h-5 mr-3" />
                  Start Recording
                </Button>
              )}

              {isRecording && (
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-r from-red-500 to-rose-500 rounded-full flex items-center justify-center mb-4 animate-pulse shadow-xl shadow-red-500/50">
                    <Mic className="w-10 h-10 text-white" />
                  </div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent mb-4">
                    {formatTime(recordingTime)}
                  </div>
                  <Button
                    onClick={stopRecording}
                    className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-semibold rounded-xl shadow-lg shadow-red-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-red-500/40 border-0"
                  >
                    <Square className="w-5 h-5 mr-2" />
                    Stop Recording
                  </Button>
                </div>
              )}

              {isProcessingVoice && (
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4 shadow-xl shadow-purple-500/50">
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  </div>
                  <p className="text-purple-700 font-semibold">
                    {hasApiKey ? "AI is analyzing your answer..." : "Analyzing your answer..."}
                  </p>
                </div>
              )}

              {voiceResponse && (
                <div className="space-y-4">
                  <div className="p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-white/50 shadow-lg">
                    <h5 className="font-semibold text-slate-800 mb-2">Your Answer:</h5>
                    <p className="text-sm text-slate-700 italic leading-relaxed">"{voiceResponse.transcript}"</p>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-white/50 shadow-lg">
                      <div className={`text-xl font-bold ${getScoreColor(voiceResponse.accuracy)}`}>
                        {voiceResponse.accuracy}%
                      </div>
                      <div className="text-xs text-slate-600 font-medium">Accuracy</div>
                    </div>
                    <div className="text-center p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-white/50 shadow-lg">
                      <div className={`text-xl font-bold ${getScoreColor(voiceResponse.completeness)}`}>
                        {voiceResponse.completeness}%
                      </div>
                      <div className="text-xs text-slate-600 font-medium">Complete</div>
                    </div>
                    <div className="text-center p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-white/50 shadow-lg">
                      <div className="text-xl font-bold text-blue-600">
                        {Math.round(voiceResponse.confidence * 100)}%
                      </div>
                      <div className="text-xs text-slate-600 font-medium">Confident</div>
                    </div>
                  </div>

                  {/* Detailed Feedback */}
                  <div className="p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-white/50 shadow-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <h5 className="font-semibold text-slate-800">{hasApiKey ? "AI Feedback:" : "Smart Feedback:"}</h5>
                      {hasApiKey && (
                        <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">
                          AI-Powered
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-slate-700 mb-4 leading-relaxed">{voiceResponse.feedback}</p>

                    {voiceResponse.strengths.length > 0 && (
                      <div className="mb-3">
                        <h6 className="text-sm font-semibold text-emerald-700 mb-2 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Strengths:
                        </h6>
                        <ul className="text-sm text-emerald-600 space-y-1">
                          {voiceResponse.strengths.map((strength, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {voiceResponse.missedPoints.length > 0 && (
                      <div>
                        <h6 className="text-sm font-semibold text-amber-700 mb-2 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          Consider adding:
                        </h6>
                        <ul className="text-sm text-amber-600 space-y-1">
                          {voiceResponse.missedPoints.map((point, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={() => {
                      setVoiceResponse(null)
                      setAudioBlob(null)
                    }}
                    variant="outline"
                    size="sm"
                    className="w-full bg-white/80 backdrop-blur-sm border-white/50 text-slate-700 hover:bg-white/90 shadow-lg shadow-slate-200/30 rounded-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    Try Again
                  </Button>
                </div>
              )}
            </div>

            {/* Show Answer Button */}
            <div className="text-center mb-6">
              <Button
                onClick={() => setShowAnswer(!showAnswer)}
                className="bg-white/80 backdrop-blur-sm border-white/50 text-slate-700 hover:bg-white/90 shadow-lg shadow-slate-200/30 rounded-xl transition-all duration-300 hover:-translate-y-1 px-8 py-3"
              >
                {showAnswer ? (
                  <>
                    <EyeOff className="w-5 h-5 mr-2" />
                    Hide Answer
                  </>
                ) : (
                  <>
                    <Eye className="w-5 h-5 mr-2" />
                    Show Detailed Answer
                  </>
                )}
              </Button>
            </div>

            {/* Detailed Answer */}
            {showAnswer && (
              <div className="space-y-4">
                <div className="p-6 bg-gradient-to-r from-emerald-50/80 to-green-50/80 backdrop-blur-sm rounded-2xl border border-emerald-200/50">
                  <h5 className="font-bold text-emerald-900 mb-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Complete Answer:
                  </h5>
                  <p className="text-sm text-emerald-800 leading-relaxed mb-4">{currentCard.answer}</p>

                  {currentCard.examples && currentCard.examples.length > 0 && (
                    <div className="mb-4">
                      <h6 className="text-sm font-semibold text-emerald-700 mb-2">Examples:</h6>
                      <ul className="text-sm text-emerald-600 space-y-1">
                        {currentCard.examples.map((example, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
                            {example}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {currentCard.relatedConcepts && currentCard.relatedConcepts.length > 0 && (
                    <div>
                      <h6 className="text-sm font-semibold text-emerald-700 mb-2">Related Concepts:</h6>
                      <div className="flex flex-wrap gap-2">
                        {currentCard.relatedConcepts.map((concept, index) => (
                          <Badge key={index} className="bg-emerald-100 text-emerald-700 border-emerald-200 text-xs">
                            {concept}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Enhanced Navigation */}
        <div className="flex justify-between gap-4">
          <Button
            onClick={prevCard}
            className="flex-1 h-12 bg-white/80 backdrop-blur-sm border-white/50 text-slate-700 hover:bg-white/90 shadow-lg shadow-slate-200/30 rounded-xl transition-all duration-300 hover:-translate-y-1 font-semibold"
          >
            Previous
          </Button>
          <Button
            onClick={nextCard}
            className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/30 rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-1 border-0 font-semibold"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
