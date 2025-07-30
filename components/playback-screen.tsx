"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Play, Pause, RotateCcw, Share2, Zap } from "lucide-react"
import type { VoiceNote } from "@/types/speakback"

interface PlaybackScreenProps {
  note: VoiceNote
  onBack: () => void
  onRerecord: () => void
  onEnhancedPlayback: () => void
}

export function PlaybackScreen({ note, onBack, onRerecord, onEnhancedPlayback }: PlaybackScreenProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Simulate audio duration
    setDuration(120) // 2 minutes
  }, [])

  const togglePlayback = () => {
    if (isPlaying) {
      setIsPlaying(false)
      // Pause audio logic here
    } else {
      setIsPlaying(true)
      // Play audio logic here

      // Simulate playback progress
      const interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false)
            clearInterval(interval)
            return 0
          }
          return prev + 1
        })
      }, 1000)
    }
  }

  const resetPlayback = () => {
    setCurrentTime(0)
    setIsPlaying(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className="flex flex-col h-full ios-18-bg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 ios-18-nav border-b border-gray-200/30">
        <Button variant="ghost" onClick={onBack} className="h-10 w-10 p-0 rounded-full ios-18-button ios-18-haptic">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="ios-18-body font-semibold text-black">Playback</h1>
        <Button variant="ghost" className="h-10 w-10 p-0 rounded-full ios-18-button ios-18-haptic">
          <Share2 className="w-5 h-5" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 space-y-6 pb-8">
          {/* Note Info */}
          <div className="ios-18-card ios-18-shadow p-4 rounded-2xl mt-4">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex-1 min-w-0">
                <h2 className="ios-18-body font-bold text-black mb-1">{note.title}</h2>
                <p className="ios-18-footnote text-gray-600">{note.subject}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">v{note.version}</Badge>
                {note.completenessScore && (
                  <Badge className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    {note.completenessScore}%
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 ios-18-caption text-gray-500">
              <span>{formatTime(duration)} duration</span>
              <span>{note.flashcards.length} flashcards</span>
              <span>{note.keyPoints.length} key points</span>
            </div>
          </div>

          {/* Audio Player */}
          <div className="ios-18-card ios-18-shadow p-6 rounded-2xl">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 ios-18-shadow">
                {isPlaying ? (
                  <Pause className="w-10 h-10 text-white" />
                ) : (
                  <Play className="w-10 h-10 text-white ml-1" />
                )}
              </div>

              <div className="text-2xl font-bold text-black mb-2 font-mono">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
              <Button
                onClick={resetPlayback}
                className="h-12 w-12 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full ios-18-button ios-18-haptic"
              >
                <RotateCcw className="w-5 h-5" />
              </Button>

              <Button
                onClick={togglePlayback}
                className="h-16 w-16 bg-blue-500 hover:bg-blue-600 text-white rounded-full ios-18-button ios-18-shadow-lg ios-18-haptic"
              >
                {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
              </Button>

              <Button
                onClick={onEnhancedPlayback}
                className="h-12 w-12 bg-purple-100 hover:bg-purple-200 text-purple-600 rounded-full ios-18-button ios-18-haptic"
              >
                <Zap className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Transcript */}
          <div className="ios-18-card ios-18-shadow p-4 rounded-2xl">
            <h3 className="ios-18-body font-semibold text-black mb-3">Transcript</h3>
            <p className="ios-18-footnote text-gray-700 leading-relaxed">{note.transcript}</p>
          </div>

          {/* Key Points */}
          <div className="ios-18-card ios-18-shadow p-4 rounded-2xl">
            <h3 className="ios-18-body font-semibold text-black mb-3">Key Points</h3>
            <div className="space-y-2">
              {note.keyPoints.map((point, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">{index + 1}</span>
                  </div>
                  <p className="ios-18-footnote text-gray-700 flex-1">{point}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button
              onClick={onEnhancedPlayback}
              className="w-full h-12 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-2xl ios-18-button ios-18-shadow border-0 ios-18-haptic"
            >
              <Zap className="w-4 h-4 mr-2" />
              Enhanced Playback
            </Button>

            <Button
              onClick={onRerecord}
              className="w-full h-12 ios-18-card ios-18-shadow text-black hover:bg-gray-50 font-semibold rounded-2xl ios-18-button ios-18-haptic"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Re-record
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
