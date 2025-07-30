"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Plus,
  Play,
  Clock,
  CheckCircle,
  AlertCircle,
  Settings,
  Search,
  BarChart3,
  Zap,
  GitBranch,
  MapPin,
  Sparkles,
  TrendingUp,
  BookOpen,
  ChevronRight,
} from "lucide-react"
import type { VoiceNote, User } from "@/types/speakback"

const formatDistanceToNow = (date: Date, options?: { addSuffix?: boolean }) => {
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  if (diffInDays === 0) return "today"
  if (diffInDays === 1) return options?.addSuffix ? "1 day ago" : "1 day"
  if (diffInDays > 0) return options?.addSuffix ? `${diffInDays} days ago` : `${diffInDays} days`

  const futureDays = Math.abs(diffInDays)
  return options?.addSuffix ? `in ${futureDays} days` : `${futureDays} days`
}

interface DashboardScreenProps {
  user: User
  voiceNotes: VoiceNote[]
  isDemo: boolean
  onNewRecording: () => void
  onPlayback: (note: VoiceNote) => void
  onReviewScreen: () => void
  onSettings: () => void
  onSearch: () => void
  onAnalytics: () => void
  onFlashcards: (note: VoiceNote) => void
  onConceptMap: () => void
  onLearningPath: () => void
  onLogout: () => void
}

export function DashboardScreen({
  user,
  voiceNotes,
  isDemo,
  onNewRecording,
  onPlayback,
  onReviewScreen,
  onSettings,
  onSearch,
  onAnalytics,
  onFlashcards,
  onConceptMap,
  onLearningPath,
  onLogout,
}: DashboardScreenProps) {
  const getStatusIcon = (note: VoiceNote) => {
    if (note.isComplete) {
      return <CheckCircle className="w-4 h-4 ios-18-green" />
    }
    if (note.nextReviewDate && note.nextReviewDate < new Date()) {
      return <AlertCircle className="w-4 h-4 ios-18-red" />
    }
    return <Clock className="w-4 h-4 ios-18-orange" />
  }

  const getStatusText = (note: VoiceNote) => {
    if (note.isComplete) return "Complete"
    if (note.nextReviewDate && note.nextReviewDate < new Date()) return "Review Due"
    return "In Progress"
  }

  const getStatusColor = (note: VoiceNote) => {
    if (note.isComplete) return "bg-green-100 text-green-800"
    if (note.nextReviewDate && note.nextReviewDate < new Date()) return "bg-red-100 text-red-800"
    return "bg-orange-100 text-orange-800"
  }

  // Group notes: main notes and their parts
  const mainNotes = voiceNotes.filter((note) => !note.parentNoteId)
  const getPartNotes = (mainNoteId: string) => voiceNotes.filter((note) => note.parentNoteId === mainNoteId)

  // Calculate review stats (only for main notes)
  const dueForReview = mainNotes.filter(
    (note) => !note.isComplete && note.nextReviewDate && note.nextReviewDate <= new Date(),
  ).length

  const completedNotes = mainNotes.filter((n) => n.isComplete).length
  const avgCompleteness =
    mainNotes.length > 0
      ? Math.round(mainNotes.reduce((sum, note) => sum + (note.completenessScore || 0), 0) / mainNotes.length)
      : 0

  return (
    <div className="flex flex-col h-full ios-18-bg">
      {/* iOS 18 Style Navigation - Fixed Header */}
      <div className="ios-18-nav px-4 py-3 border-b border-gray-200/30 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="ios-18-large-title text-black truncate">{isDemo ? "Demo" : "SpeakBack"}</h1>
              {isDemo && (
                <Badge className="bg-blue-500 text-white border-0 text-xs px-2 py-1 rounded-full ios-18-shadow">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Demo
                </Badge>
              )}
            </div>
            <p className="ios-18-footnote text-gray-600">Welcome back, {user.name}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onSearch}
              className="h-8 w-8 p-0 ios-18-blue hover:bg-blue-50 rounded-full ios-18-button ios-18-haptic"
            >
              <Search className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onSettings}
              className="h-8 w-8 p-0 text-gray-600 hover:bg-gray-100 rounded-full ios-18-button ios-18-haptic"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 space-y-6 pb-8">
          {/* iOS 18 Style Stats Cards */}
          <div className="grid grid-cols-3 gap-3 pt-4">
            <div className="ios-18-card ios-18-shadow p-4 text-center ios-18-haptic">
              <div className="text-2xl font-bold text-black mb-1">{mainNotes.length}</div>
              <div className="ios-18-caption">Topics</div>
            </div>
            <div className="ios-18-card ios-18-shadow p-4 text-center ios-18-haptic">
              <div className="text-2xl font-bold ios-18-green mb-1">{completedNotes}</div>
              <div className="ios-18-caption">Complete</div>
            </div>
            <div className="ios-18-card ios-18-shadow p-4 text-center ios-18-haptic">
              <div className="text-2xl font-bold ios-18-red mb-1">{dueForReview}</div>
              <div className="ios-18-caption">Due</div>
            </div>
          </div>

          {/* iOS 18 Style Progress Card */}
          {mainNotes.length > 0 && (
            <div className="ios-18-card ios-18-shadow p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="ios-18-body font-semibold text-black">Your Progress</h3>
                <TrendingUp className="w-5 h-5 text-gray-400" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="ios-18-footnote text-gray-600">Overall Completion</span>
                  <span className="ios-18-footnote font-semibold text-black">
                    {Math.round((completedNotes / mainNotes.length) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-500 h-3 rounded-full transition-all duration-500 ios-18-shadow-sm"
                    style={{ width: `${(completedNotes / mainNotes.length) * 100}%` }}
                  />
                </div>
                <div className="flex items-center justify-between ios-18-caption text-gray-500">
                  <span>Avg. Quality: {avgCompleteness}%</span>
                  <span>{mainNotes.length} total topics</span>
                </div>
              </div>
            </div>
          )}

          {/* iOS 18 Style Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={onNewRecording}
              className="w-full h-14 bg-blue-500 hover:bg-blue-600 text-white font-semibold ios-18-body rounded-2xl ios-18-button ios-18-shadow-lg border-0 ios-18-haptic"
            >
              <Plus className="w-5 h-5 mr-3" />
              New Voice Note
            </Button>

            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={onReviewScreen}
                className={`h-12 font-semibold rounded-2xl ios-18-button ios-18-haptic ${
                  dueForReview > 0
                    ? "bg-red-500 hover:bg-red-600 text-white ios-18-shadow-lg"
                    : "ios-18-card ios-18-shadow text-black hover:bg-gray-50"
                }`}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                <div className="text-left">
                  <div className="text-sm">Review</div>
                  {dueForReview > 0 && <div className="text-xs opacity-90">{dueForReview} due</div>}
                </div>
              </Button>

              <Button
                onClick={onAnalytics}
                className="h-12 font-semibold rounded-2xl ios-18-card ios-18-shadow text-black hover:bg-gray-50 ios-18-button ios-18-haptic"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                <div className="text-left">
                  <div className="text-sm">Analytics</div>
                  <div className="text-xs text-gray-500">Insights</div>
                </div>
              </Button>
            </div>
          </div>

          {/* iOS 18 Style AI Features Section */}
          <div className="ios-18-control ios-18-shadow-lg p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-purple-500 rounded-xl flex items-center justify-center ios-18-shadow">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-black ios-18-body">AI Study Tools</h3>
                <p className="ios-18-caption text-gray-600">Powered by artificial intelligence</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={onConceptMap}
                className="h-14 ios-18-card ios-18-shadow text-purple-600 hover:bg-purple-50 rounded-2xl ios-18-button ios-18-haptic p-3"
              >
                <GitBranch className="w-4 h-4 mr-2 flex-shrink-0" />
                <div className="text-left min-w-0">
                  <div className="text-sm font-semibold truncate">Concept Map</div>
                  <div className="text-xs opacity-75 truncate">Visual connections</div>
                </div>
              </Button>

              <Button
                onClick={onLearningPath}
                className="h-14 ios-18-card ios-18-shadow text-blue-600 hover:bg-blue-50 rounded-2xl ios-18-button ios-18-haptic p-3"
              >
                <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                <div className="text-left min-w-0">
                  <div className="text-sm font-semibold truncate">Learning Path</div>
                  <div className="text-xs opacity-75 truncate">Optimal sequence</div>
                </div>
              </Button>
            </div>
          </div>

          {/* iOS 18 Style Voice Notes List */}
          <div className="space-y-4">
            <h2 className="ios-18-body font-semibold text-black px-1">Your Voice Notes</h2>

            {mainNotes.length === 0 ? (
              <div className="ios-18-card ios-18-shadow p-8 text-center">
                <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 ios-18-shadow">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-black mb-2 ios-18-body">No voice notes yet</h3>
                <p className="ios-18-footnote text-gray-600">Create your first voice note to get started!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {mainNotes.map((note) => {
                  const partNotes = getPartNotes(note.id)

                  return (
                    <div key={note.id}>
                      {/* Main Note - iOS 18 List Style */}
                      <div className="ios-18-card ios-18-shadow ios-18-haptic">
                        <div className="p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              {/* Title and Status */}
                              <div className="flex items-center gap-2 mb-2">
                                {getStatusIcon(note)}
                                <h3 className="font-semibold text-black text-base truncate flex-1" title={note.title}>
                                  {note.title}
                                </h3>
                              </div>

                              {/* Subject */}
                              <p className="ios-18-footnote text-gray-600 mb-2 truncate">{note.subject}</p>

                              {/* Status and metadata */}
                              <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <Badge
                                  className={`${getStatusColor(note)} text-xs px-2 py-1 rounded-full ios-18-shadow-sm`}
                                >
                                  {getStatusText(note)}
                                </Badge>
                                {note.completenessScore && (
                                  <Badge className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full ios-18-shadow-sm">
                                    {note.completenessScore}%
                                  </Badge>
                                )}
                                <Badge className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full ios-18-shadow-sm">
                                  v{note.version}
                                </Badge>
                                {partNotes.length > 0 && (
                                  <Badge className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full ios-18-shadow-sm">
                                    +{partNotes.length}
                                  </Badge>
                                )}
                              </div>

                              {/* Dates */}
                              <div className="flex items-center justify-between ios-18-caption text-gray-500">
                                <span className="truncate">
                                  {formatDistanceToNow(note.createdAt, { addSuffix: true })}
                                </span>
                                {note.nextReviewDate && (
                                  <span className="truncate ml-2">
                                    Review: {formatDistanceToNow(note.nextReviewDate, { addSuffix: true })}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Action buttons */}
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onPlayback(note)}
                                className="h-8 w-8 p-0 ios-18-blue hover:bg-blue-50 rounded-full ios-18-button ios-18-haptic"
                              >
                                <Play className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onFlashcards(note)}
                                className="h-8 w-8 p-0 ios-18-purple hover:bg-purple-50 rounded-full ios-18-button ios-18-haptic"
                              >
                                <Zap className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Part Notes - iOS 18 Grouped Style */}
                        {partNotes.map((partNote) => (
                          <div key={partNote.id}>
                            <div className="h-px bg-gray-200 mx-4" />
                            <div className="px-4 py-3">
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <ChevronRight className="w-3 h-3 text-gray-400 flex-shrink-0" />
                                    <h4 className="font-medium text-black text-sm truncate" title={partNote.title}>
                                      {partNote.title}
                                    </h4>
                                  </div>

                                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                                    {partNote.completenessScore && (
                                      <Badge className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full ios-18-shadow-sm">
                                        {partNote.completenessScore}%
                                      </Badge>
                                    )}
                                    <Badge className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full ios-18-shadow-sm">
                                      v{partNote.version}
                                    </Badge>
                                    <span className="ios-18-caption text-gray-500 truncate">
                                      {formatDistanceToNow(partNote.createdAt, { addSuffix: true })}
                                    </span>
                                  </div>
                                </div>

                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => onPlayback(partNote)}
                                  className="h-7 w-7 p-0 ios-18-purple hover:bg-purple-50 rounded-full ios-18-button ios-18-haptic flex-shrink-0"
                                >
                                  <Play className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
