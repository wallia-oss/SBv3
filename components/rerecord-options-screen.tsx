"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Plus, FileText } from "lucide-react"
import type { VoiceNote } from "@/types/speakback"

interface RerecordOptionsScreenProps {
  note: VoiceNote
  onBack: () => void
  onAppend: () => void
  onPart2: () => void
}

export function RerecordOptionsScreen({ note, onBack, onAppend, onPart2 }: RerecordOptionsScreenProps) {
  return (
    <div className="min-h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-900">Choose Update Mode</h1>
        </div>
      </div>

      <div className="p-4 space-y-4 pb-8">
        {/* Append Option */}
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onAppend}>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Plus className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Append to end</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Continue from where you left off. Your new recording will be added to the existing explanation,
                  creating one continuous voice note.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Part 2 Option */}
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onPart2}>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Add as Part 2</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Record a new additional section. This will create a separate segment that can be played independently
                  or together with the original.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
