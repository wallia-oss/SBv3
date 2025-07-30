"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Mic, TrendingUp, Volume2, Clock, BarChart3 } from "lucide-react"
import type { VoiceNote } from "@/types/speakback"

interface VoiceMetrics {
  confidence: number // 0-1
  pace: number // words per minute
  clarity: number // 0-1
  hesitation: number // 0-1 (lower is better)
  volume: number // 0-1
  engagement: number // 0-1
}

interface VoiceAnalysisScreenProps {
  note: VoiceNote
  onBack: () => void
}

export function VoiceAnalysisScreen({ note, onBack }: VoiceAnalysisScreenProps) {
  const [metrics, setMetrics] = useState<VoiceMetrics | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(true)

  useEffect(() => {
    if (!note) return
    analyzeVoice()
  }, [note])

  const analyzeVoice = async () => {
    setIsAnalyzing(true)

    // Simulate AI voice analysis
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Generate mock voice metrics based on note data with safe defaults
    const completenessScore = note && typeof note.completenessScore === "number" ? note.completenessScore : 50
    const mockMetrics: VoiceMetrics = {
      confidence: Math.min(0.9, completenessScore / 100 + Math.random() * 0.2),
      pace: 120 + Math.random() * 60, // 120-180 WPM
      clarity: 0.7 + Math.random() * 0.3,
      hesitation: Math.random() * 0.4,
      volume: 0.6 + Math.random() * 0.4,
      engagement: Math.min(0.95, completenessScore / 100 + Math.random() * 0.3),
    }

    setMetrics(mockMetrics)
    setIsAnalyzing(false)
  }

  const getScoreColor = (score: number, inverted = false) => {
    const adjustedScore = inverted ? 1 - score : score
    if (adjustedScore >= 0.8) return "text-green-600"
    if (adjustedScore >= 0.6) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBackground = (score: number, inverted = false) => {
    const adjustedScore = inverted ? 1 - score : score
    if (adjustedScore >= 0.8) return "bg-green-100"
    if (adjustedScore >= 0.6) return "bg-yellow-100"
    return "bg-red-100"
  }

  const getScoreText = (score: number, inverted = false) => {
    const adjustedScore = inverted ? 1 - score : score
    if (adjustedScore >= 0.8) return "Excellent"
    if (adjustedScore >= 0.6) return "Good"
    return "Needs Work"
  }

  if (isAnalyzing) {
    return (
      <div className="min-h-full bg-gray-50">
        <div className="bg-white border-b border-gray-200 px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-xl font-semibold text-gray-900">Analyzing Voice</h1>
          </div>
        </div>

        <div className="p-4 flex items-center justify-center h-96">
          <Card className="w-full max-w-sm">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-green-600 rounded-full flex items-center justify-center animate-pulse">
                <Mic className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Voice Analysis</h3>
              <p className="text-sm text-gray-600">AI is analyzing your speech patterns, confidence, and clarity...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!metrics) return null

  return (
    <div className="min-h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-gray-900">Voice Analysis</h1>
            <p className="text-sm text-gray-600">{note?.title || "Voice Note"}</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6 pb-8">
        {/* Overall Score */}
        <Card>
          <CardContent className="p-6 text-center">
            <div
              className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center ${getScoreBackground(metrics.confidence)} mb-4`}
            >
              <div className={`text-2xl font-bold ${getScoreColor(metrics.confidence)}`}>
                {Math.round(metrics.confidence * 100)}
              </div>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Confidence Score</h3>
            <p className="text-sm text-gray-600">
              {getScoreText(metrics.confidence)} - Your voice shows{" "}
              {metrics.confidence >= 0.8 ? "high" : metrics.confidence >= 0.6 ? "moderate" : "low"} confidence in the
              subject matter.
            </p>
          </CardContent>
        </Card>

        {/* Detailed Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardContent className="p-4 text-center">
              <Volume2 className={`w-6 h-6 mx-auto mb-2 ${getScoreColor(metrics.clarity)}`} />
              <div className={`text-xl font-bold ${getScoreColor(metrics.clarity)}`}>
                {Math.round(metrics.clarity * 100)}%
              </div>
              <div className="text-xs text-gray-600">Clarity</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Clock
                className={`w-6 h-6 mx-auto mb-2 ${metrics.pace >= 140 && metrics.pace <= 160 ? "text-green-600" : "text-yellow-600"}`}
              />
              <div
                className={`text-xl font-bold ${metrics.pace >= 140 && metrics.pace <= 160 ? "text-green-600" : "text-yellow-600"}`}
              >
                {Math.round(metrics.pace)}
              </div>
              <div className="text-xs text-gray-600">WPM</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className={`w-6 h-6 mx-auto mb-2 ${getScoreColor(metrics.engagement)}`} />
              <div className={`text-xl font-bold ${getScoreColor(metrics.engagement)}`}>
                {Math.round(metrics.engagement * 100)}%
              </div>
              <div className="text-xs text-gray-600">Engagement</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <BarChart3 className={`w-6 h-6 mx-auto mb-2 ${getScoreColor(metrics.hesitation, true)}`} />
              <div className={`text-xl font-bold ${getScoreColor(metrics.hesitation, true)}`}>
                {Math.round((1 - metrics.hesitation) * 100)}%
              </div>
              <div className="text-xs text-gray-600">Fluency</div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analysis */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Detailed Analysis</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Speaking Pace</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${metrics.pace >= 140 && metrics.pace <= 160 ? "bg-green-600" : "bg-yellow-600"}`}
                      style={{ width: `${Math.min(100, (metrics.pace / 200) * 100)}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">{Math.round(metrics.pace)} WPM</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Voice Volume</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${metrics.volume * 100}%` }} />
                  </div>
                  <span className="text-xs text-gray-500">{Math.round(metrics.volume * 100)}%</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Hesitation Level</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${metrics.hesitation < 0.3 ? "bg-green-600" : metrics.hesitation < 0.6 ? "bg-yellow-600" : "bg-red-600"}`}
                      style={{ width: `${metrics.hesitation * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">
                    {metrics.hesitation < 0.3 ? "Low" : metrics.hesitation < 0.6 ? "Medium" : "High"}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-900 mb-3">AI Recommendations</h3>
            <div className="space-y-2 text-sm">
              {metrics.confidence < 0.6 && (
                <p className="text-blue-800">• Practice explaining this topic more to build confidence</p>
              )}
              {metrics.pace < 120 && (
                <p className="text-blue-800">• Try speaking a bit faster to maintain engagement</p>
              )}
              {metrics.pace > 180 && (
                <p className="text-blue-800">• Slow down slightly to improve clarity and comprehension</p>
              )}
              {metrics.clarity < 0.7 && <p className="text-blue-800">• Focus on articulation and pronunciation</p>}
              {metrics.hesitation > 0.5 && (
                <p className="text-blue-800">• Review the material more before recording to reduce hesitation</p>
              )}
              {metrics.volume < 0.5 && <p className="text-blue-800">• Speak with more volume and energy</p>}
              {metrics.engagement < 0.6 && <p className="text-blue-800">• Add more enthusiasm and vary your tone</p>}
            </div>
          </CardContent>
        </Card>

        {/* Progress Tracking */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Progress Over Time</h3>
            <div className="h-32 bg-gray-100 rounded-lg flex items-end justify-center p-4">
              <div className="flex items-end gap-2 h-full">
                {[65, 72, 68, 78, Math.round(metrics.confidence * 100)].map((height, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div
                      className={`bg-blue-600 rounded-t w-6 transition-all duration-300 ${index === 4 ? "bg-green-600" : ""}`}
                      style={{ height: `${height}%` }}
                    />
                    <span className="text-xs text-gray-500 mt-1">{index === 4 ? "Now" : `v${index + 1}`}</span>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-xs text-gray-500 text-center mt-2">Confidence scores across versions</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
