"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { X, Share2, MessageCircle, Mail, Copy, Check } from "lucide-react"
import type { VoiceNote } from "@/types/speakback"

interface ShareModalProps {
  note: VoiceNote
  onClose: () => void
}

export function ShareModal({ note, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false)
  const [studyGroupCode, setStudyGroupCode] = useState("")

  const shareText = `📚 Check out my study note: "${note.title}" 

Subject: ${note.subject}
Completeness: ${note.completenessScore}%

${note.transcript ? note.transcript.substring(0, 200) + "..." : ""}

#StudyNotes #${note.subject.replace(/\s+/g, "")}`

  const shareUrl = `https://speakback.app/shared/${note.id}` // Mock URL

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const shareViaWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText + "\n\n" + shareUrl)}`
    window.open(whatsappUrl, "_blank")
  }

  const shareViaEmail = () => {
    const subject = `Study Note: ${note.title}`
    const body = shareText + "\n\n" + shareUrl
    const emailUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.open(emailUrl)
  }

  const joinStudyGroup = () => {
    if (!studyGroupCode.trim()) return
    // Mock study group joining
    alert(`Joined study group: ${studyGroupCode}`)
    setStudyGroupCode("")
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Share Note</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Note Preview */}
          <div className="mb-6 p-3 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-1">{note.title}</h3>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-xs">
                {note.subject}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {note.completenessScore}%
              </Badge>
            </div>
            <p className="text-xs text-gray-600 line-clamp-2">
              {note.transcript?.substring(0, 100) + "..." || "No transcript available"}
            </p>
          </div>

          {/* Share Options */}
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Share via</h3>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={shareViaWhatsApp}
                  variant="outline"
                  className="flex items-center gap-2 bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </Button>

                <Button
                  onClick={shareViaEmail}
                  variant="outline"
                  className="flex items-center gap-2 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                >
                  <Mail className="w-4 h-4" />
                  Email
                </Button>
              </div>
            </div>

            {/* Copy Link */}
            <div>
              <Label className="text-sm font-medium text-gray-700">Share Link</Label>
              <div className="flex gap-2 mt-1">
                <Input value={shareUrl} readOnly className="flex-1 text-xs" />
                <Button
                  onClick={() => copyToClipboard(shareUrl)}
                  size="sm"
                  className={copied ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {/* Study Group */}
            <div className="border-t pt-4">
              <h3 className="font-medium text-gray-900 mb-3">Study Groups</h3>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Join Study Group</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      value={studyGroupCode}
                      onChange={(e) => setStudyGroupCode(e.target.value)}
                      placeholder="Enter group code"
                      className="flex-1"
                    />
                    <Button onClick={joinStudyGroup} size="sm" disabled={!studyGroupCode.trim()}>
                      Join
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Ask your classmates for their group code</p>
                </div>

                <Button variant="outline" className="w-full bg-transparent">
                  <Share2 className="w-4 h-4 mr-2" />
                  Create New Study Group
                </Button>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <Button onClick={onClose} className="w-full mt-6 bg-gray-600 hover:bg-gray-700 text-white">
            Close
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
