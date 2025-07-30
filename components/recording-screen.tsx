"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Mic, Square, Play, Pause, ArrowLeft, RotateCcw } from "lucide-react"
import type { Recording } from "@/types/speakback"

interface RecordingScreenProps {
  onComplete: (recording: Recording) => void
  onCancel: () => void
}

export function RecordingScreen({ onComplete, onCancel }: RecordingScreenProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [duration, setDuration] = useState(0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const chunksRef = useRef<Blob[]>([])

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop()
      }
    }
  }, [])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" })
        setAudioBlob(blob)
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      setIsPaused(false)

      intervalRef.current = setInterval(() => {
        setDuration((prev) => prev + 1)
      }, 1000)
    } catch (error) {
      console.error("Error starting recording:", error)
    }
  }

  const pauseRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.pause()
      setIsPaused(true)
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }

  const resumeRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "paused") {
      mediaRecorderRef.current.resume()
      setIsPaused(false)
      intervalRef.current = setInterval(() => {
        setDuration((prev) => prev + 1)
      }, 1000)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setIsPaused(false)
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }

  const playRecording = () => {
    if (audioBlob && audioRef.current) {
      const audioUrl = URL.createObjectURL(audioBlob)
      audioRef.current.src = audioUrl
      audioRef.current.play()
      setIsPlaying(true)

      audioRef.current.onended = () => {
        setIsPlaying(false)
        URL.revokeObjectURL(audioUrl)
      }
    }
  }

  const pausePlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }

  const resetRecording = () => {
    setAudioBlob(null)
    setDuration(0)
    setIsPlaying(false)
    if (audioRef.current) {
      audioRef.current.src = ""
    }
  }

  const handleComplete = () => {
    if (audioBlob) {
      const recording: Recording = {
        id: `recording-${Date.now()}`,
        audioBlob,
        duration,
        createdAt: new Date(),
      }
      onComplete(recording)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="flex flex-col h-full ios-18-bg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 ios-18-nav border-b border-gray-200/30">
        <Button variant="ghost" onClick={onCancel} className="h-10 w-10 p-0 rounded-full ios-18-button ios-18-haptic">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="ios-18-body font-semibold text-black">New Recording</h1>
        <div className="w-10" />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        {/* Recording Visualization */}
        <div className="relative mb-8">
          <div
            className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ${
              isRecording && !isPaused ? "bg-red-500 animate-pulse ios-18-shadow-lg" : "bg-blue-500 ios-18-shadow"
            }`}
          >
            <Mic className="w-16 h-16 text-white" />
          </div>

          {/* Recording indicator */}
          {isRecording && !isPaused && (
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
              <div className="w-3 h-3 bg-white rounded-full" />
            </div>
          )}
        </div>

        {/* Duration */}
        <div className="ios-18-card ios-18-shadow p-4 rounded-2xl mb-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-black mb-2 font-mono">{formatTime(duration)}</div>
            <p className="ios-18-caption text-gray-600">
              {isRecording && !isPaused
                ? "Recording..."
                : isPaused
                  ? "Paused"
                  : audioBlob
                    ? "Ready to save"
                    : "Tap to start"}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4 mb-8">
          {!isRecording && !audioBlob && (
            <Button
              onClick={startRecording}
              className="w-16 h-16 bg-red-500 hover:bg-red-600 text-white rounded-full ios-18-button ios-18-shadow-lg border-0 ios-18-haptic"
            >
              <Mic className="w-8 h-8" />
            </Button>
          )}

          {isRecording && (
            <>
              <Button
                onClick={isPaused ? resumeRecording : pauseRecording}
                className="w-14 h-14 bg-orange-500 hover:bg-orange-600 text-white rounded-full ios-18-button ios-18-shadow border-0 ios-18-haptic"
              >
                {isPaused ? <Play className="w-6 h-6" /> : <Pause className="w-6 h-6" />}
              </Button>

              <Button
                onClick={stopRecording}
                className="w-16 h-16 bg-gray-600 hover:bg-gray-700 text-white rounded-full ios-18-button ios-18-shadow-lg border-0 ios-18-haptic"
              >
                <Square className="w-8 h-8" />
              </Button>
            </>
          )}

          {audioBlob && (
            <>
              <Button
                onClick={isPlaying ? pausePlayback : playRecording}
                className="w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full ios-18-button ios-18-shadow border-0 ios-18-haptic"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </Button>

              <Button
                onClick={resetRecording}
                className="w-14 h-14 bg-gray-500 hover:bg-gray-600 text-white rounded-full ios-18-button ios-18-shadow border-0 ios-18-haptic"
              >
                <RotateCcw className="w-6 h-6" />
              </Button>
            </>
          )}
        </div>

        {/* Instructions */}
        <div className="ios-18-control ios-18-shadow p-4 rounded-2xl max-w-sm text-center">
          <p className="ios-18-footnote text-gray-600 leading-relaxed">
            {!isRecording && !audioBlob && "Tap the microphone to start recording your voice note"}
            {isRecording && !isPaused && "Recording in progress. Tap pause to take a break or stop to finish."}
            {isPaused && "Recording paused. Tap play to continue or stop to finish."}
            {audioBlob && "Great! Review your recording and tap 'Continue' when ready."}
          </p>
        </div>
      </div>

      {/* Bottom Actions */}
      {audioBlob && (
        <div className="p-6">
          <Button
            onClick={handleComplete}
            className="w-full h-14 bg-blue-500 hover:bg-blue-600 text-white font-semibold ios-18-body rounded-2xl ios-18-button ios-18-shadow-lg border-0 ios-18-haptic"
          >
            Continue to Analysis
          </Button>
        </div>
      )}

      <audio ref={audioRef} className="hidden" />
    </div>
  )
}
