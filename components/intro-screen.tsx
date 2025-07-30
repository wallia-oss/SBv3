"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronRight, ChevronLeft, Mic, Brain, Zap, Calendar, TrendingUp, Sparkles } from "lucide-react"

interface IntroScreenProps {
  onNext: () => void
}

const steps = [
  {
    id: 1,
    title: "Record Your Voice",
    description: "Capture your thoughts, lectures, or study sessions with high-quality audio recording.",
    icon: Mic,
    color: "bg-blue-500",
    gradient: "from-blue-400 to-blue-600",
  },
  {
    id: 2,
    title: "AI Analysis",
    description: "Our advanced AI analyzes your recordings to extract key concepts and insights.",
    icon: Brain,
    color: "bg-purple-500",
    gradient: "from-purple-400 to-purple-600",
  },
  {
    id: 3,
    title: "Smart Flashcards",
    description: "Automatically generated flashcards help you review and memorize important information.",
    icon: Zap,
    color: "bg-orange-500",
    gradient: "from-orange-400 to-orange-600",
  },
  {
    id: 4,
    title: "Spaced Repetition",
    description: "Scientifically-proven spaced repetition system optimizes your learning schedule.",
    icon: Calendar,
    color: "bg-green-500",
    gradient: "from-green-400 to-green-600",
  },
  {
    id: 5,
    title: "Track Progress",
    description: "Monitor your learning journey with detailed analytics and progress tracking.",
    icon: TrendingUp,
    color: "bg-pink-500",
    gradient: "from-pink-400 to-pink-600",
  },
]

export function IntroScreen({ onNext }: IntroScreenProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isAnimating) {
        setIsAnimating(true)
        setTimeout(() => {
          setCurrentStep((prev) => (prev + 1) % steps.length)
          setIsAnimating(false)
        }, 300)
      }
    }, 4000)

    return () => clearInterval(timer)
  }, [isAnimating])

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentStep(currentStep + 1)
        setIsAnimating(false)
      }, 300)
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentStep(currentStep - 1)
        setIsAnimating(false)
      }, 300)
    }
  }

  const handleSkip = () => {
    localStorage.setItem("speakback-intro-completed", "true")
    onNext()
  }

  const handleGetStarted = () => {
    localStorage.setItem("speakback-intro-completed", "true")
    onNext()
  }

  const currentStepData = steps[currentStep]
  const IconComponent = currentStepData.icon

  return (
    <div className="flex flex-col h-full ios-18-bg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded-xl flex items-center justify-center ios-18-shadow">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <h1 className="ios-18-large-title text-black">SpeakBack</h1>
        </div>
        <Button
          variant="ghost"
          onClick={handleSkip}
          className="text-blue-500 hover:bg-blue-50 rounded-xl ios-18-button ios-18-haptic"
        >
          Skip
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-8">
        {/* Step Indicator */}
        <div className="flex items-center gap-2 mb-8">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentStep ? "w-8 bg-blue-500" : "w-2 bg-gray-300"
              }`}
            />
          ))}
        </div>

        {/* Icon */}
        <div
          className={`w-24 h-24 rounded-3xl flex items-center justify-center mb-8 ios-18-shadow-lg transition-all duration-500 ${
            isAnimating ? "scale-95 opacity-70" : "scale-100 opacity-100"
          } bg-gradient-to-br ${currentStepData.gradient}`}
        >
          <IconComponent className="w-12 h-12 text-white" />
        </div>

        {/* Content */}
        <div
          className={`text-center transition-all duration-500 ${
            isAnimating ? "opacity-0 transform translate-y-4" : "opacity-100 transform translate-y-0"
          }`}
        >
          <h2 className="ios-18-large-title text-black mb-4">{currentStepData.title}</h2>
          <p className="ios-18-body text-gray-600 leading-relaxed max-w-sm">{currentStepData.description}</p>
        </div>

        {/* Benefits */}
        <div className="mt-8 ios-18-card ios-18-shadow p-4 rounded-2xl max-w-sm">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">✓</span>
            </div>
            <div>
              <p className="ios-18-footnote font-semibold text-black">
                {currentStep === 0 && "High-quality audio capture"}
                {currentStep === 1 && "Advanced AI processing"}
                {currentStep === 2 && "Personalized learning cards"}
                {currentStep === 3 && "Optimized review timing"}
                {currentStep === 4 && "Detailed progress insights"}
              </p>
              <p className="ios-18-caption text-gray-500">
                {currentStep === 0 && "Crystal clear recordings every time"}
                {currentStep === 1 && "Understands context and meaning"}
                {currentStep === 2 && "Tailored to your learning style"}
                {currentStep === 3 && "Based on memory science"}
                {currentStep === 4 && "Track your improvement"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="p-6 space-y-4">
        {currentStep === steps.length - 1 ? (
          <Button
            onClick={handleGetStarted}
            className="w-full h-14 bg-blue-500 hover:bg-blue-600 text-white font-semibold ios-18-body rounded-2xl ios-18-button ios-18-shadow-lg border-0 ios-18-haptic"
          >
            Get Started
          </Button>
        ) : (
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="h-12 w-12 p-0 rounded-2xl ios-18-card ios-18-shadow disabled:opacity-50 ios-18-button ios-18-haptic"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              onClick={handleNext}
              className="flex-1 h-12 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-2xl ios-18-button ios-18-shadow-lg border-0 ios-18-haptic"
            >
              Next
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        )}

        {/* Progress Text */}
        <p className="text-center ios-18-caption text-gray-500">
          Step {currentStep + 1} of {steps.length}
        </p>
      </div>
    </div>
  )
}
