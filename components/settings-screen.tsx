"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"

interface SettingsScreenProps {
  onBack: () => void
}

export function SettingsScreen({ onBack }: SettingsScreenProps) {
  const [apiKey, setApiKey] = useState("")
  const [aiPromptsEnabled, setAiPromptsEnabled] = useState(true)
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const storedKey = localStorage.getItem("openai_api_key")
    const promptsSetting = localStorage.getItem("ai_prompts_enabled")
    const themeSetting = localStorage.getItem("dark_mode")

    if (storedKey) setApiKey(storedKey)
    if (promptsSetting) setAiPromptsEnabled(promptsSetting === "true")
    if (themeSetting) setDarkMode(themeSetting === "true")
  }, [])

  const saveSettings = () => {
    localStorage.setItem("openai_api_key", apiKey)
    localStorage.setItem("ai_prompts_enabled", String(aiPromptsEnabled))
    localStorage.setItem("dark_mode", String(darkMode))
    alert("✅ Settings saved!")
  }

  return (
    <div className="p-6">
      <ArrowLeft className="mb-4 cursor-pointer" onClick={onBack} />
      <Card>
        <CardContent className="space-y-6 p-6">
          <div>
            <Label htmlFor="apiKey">🔑 OpenAI API Key</Label>
            <Input
              id="apiKey"
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="mt-2"
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>🧠 Enable AI Prompts</Label>
            <Switch
              checked={aiPromptsEnabled}
              onCheckedChange={setAiPromptsEnabled}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>🌗 Dark Mode</Label>
            <Switch
              checked={darkMode}
              onCheckedChange={setDarkMode}
            />
          </div>

          <Button onClick={saveSettings} className="w-full">Save Settings</Button>
        </CardContent>
      </Card>
    </div>
  )
}
