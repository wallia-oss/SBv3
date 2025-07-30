"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import {
  ArrowLeft,
  Play,
  Pause,
  Volume2,
  Share2,
  BookOpen,
  BarChart3,
  Brain,
  Mic,
  Clock,
  TrendingUp,
} from "lucide-react"
import type { VoiceNote, Screen } from "@/types/speakback"

interface EnhancedPlaybackScreenProps {
  note: VoiceNote
  onBack: () => void
  onNavigate: (screen: Screen) => void
}

export function EnhancedPlaybackScreen({ note, onBack, onNavigate }: EnhancedPlaybackScreenProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState([80])
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (note.audioUrl) {
      audioRef.current = new Audio(note.audioUrl)
    } else if (note.audioBlob) {
      const audioUrl = URL.createObjectURL(note.audioBlob)
      audioRef.current = new Audio(audioUrl)
      return () => URL.revokeObjectURL(audioUrl)
    }

    const audio = audioRef.current
    if (audio) {
      audio.addEventListener("timeupdate", handleTimeUpdate)
      audio.addEventListener("ended", handleEnded)
      audio.volume = volume[0] / 100

      return () => {
        audio.removeEventListener("timeupdate", handleTimeUpdate)
        audio.removeEventListener("ended", handleEnded)
      }
    }
  }, [note, volume])

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleEnded = () => {
    setIsPlaying(false)
    setCurrentTime(0)
  }

  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0]
      setCurrentTime(value[0])
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="min-h-full bg-gradient-to-br from-indigo-50 to-purple-50 flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 px-4 py-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-gray-900">{note.title}</h1>
            <p className="text-sm text-gray-600">{note.subject || "Voice Note"}</p>
          </div>
          <Button variant="ghost" size="sm">
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-3 text-center">
              <Clock className="w-5 h-5 mx-auto mb-1 text-blue-600" />
              <div className="text-lg font-bold text-gray-900">{Math.round(note.duration)}s</div>
              <div className="text-xs text-gray-600">Duration</div>
            </CardContent>
          </Card>
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-3 text-center">
              <TrendingUp className="w-5 h-5 mx-auto mb-1 text-green-600" />
              <div className="text-lg font-bold text-gray-900">{note.completenessScore}%</div>
              <div className="text-xs text-gray-600">Score</div>
            </CardContent>
          </Card>
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-3 text-center">
              <Mic className="w-5 h-5 mx-auto mb-1 text-purple-600" />
              <div className="text-lg font-bold text-gray-900">{note.keyPoints?.length || 0}</div>
              <div className="text-xs text-gray-600">Key Points</div>
            </CardContent>
          </Card>
        </div>

        {/* Audio Player */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-center mb-6">
              <Button
                onClick={togglePlayback}
                size="lg"
                className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-full w-16 h-16 shadow-xl"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </Button>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <Slider
                value={[currentTime]}
                max={note.duration}
                step={0.1}
                onValueChange={handleSeek}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(note.duration)}</span>
              </div>
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-3 mt-4">
              <Volume2 className="w-4 h-4 text-gray-600" />
              <Slider value={volume} max={100} step={1} onValueChange={setVolume} className="flex-1" />
              <span className="text-sm text-gray-600 w-8">{volume[0]}%</span>
            </div>
          </CardContent>
        </Card>

        {/* Transcript */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Transcript</h3>
            <p className="text-gray-700 leading-relaxed">{note.transcript}</p>
          </CardContent>
        </Card>

        {/* Key Points */}
        {note.keyPoints && note.keyPoints.length > 0 && (
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Key Points</h3>
              <div className="space-y-2">
                {note.keyPoints.map((point, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <p className="text-sm text-gray-700">{point}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* AI Feedback */}
        {note.feedback && (
          <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-3">AI Feedback</h3>
              <p className="text-gray-700">{note.feedback}</p>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={() => onNavigate("enhanced-flashcards")}
            className="bg-orange-500 hover:bg-orange-600 text-white shadow-lg"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Study Cards
          </Button>
          <Button
            onClick={() => onNavigate("voice-analysis")}
            className="bg-green-500 hover:bg-green-600 text-white shadow-lg"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Voice Analysis
          </Button>
        </div>

        <Button
          onClick={() => onNavigate("concept-map")}
          variant="outline"
          className="w-full bg-white/70 backdrop-blur-sm border-gray-200 hover:bg-white hover:shadow-md"
        >
          <Brain className="w-4 h-4 mr-2" />
          View Concept Map
        </Button>
      </div>
    </div>
  )
}
