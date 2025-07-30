export interface TranscriptionResult {
  text: string
  confidence?: number
  language?: string
}

export interface GPTEvaluationResult {
  completenessScore: number
  aiPrompt: string
  suggestedTags: string[]
  feedback: string
}

export class WhisperService {
  private apiKey: string | null = null

  constructor() {
    // Load API key from localStorage
    if (typeof window !== "undefined") {
      this.apiKey = localStorage.getItem("speakback-openai-key")
    }
  }

  private getApiKey(): string | null {
    if (!this.apiKey && typeof window !== "undefined") {
      this.apiKey = localStorage.getItem("speakback-openai-key")
    }
    return this.apiKey
  }

  async transcribeAudio(audioBlob: Blob): Promise<TranscriptionResult> {
    const apiKey = this.getApiKey()

    if (!apiKey) {
      // Return mock data if no API key
      return this.getMockTranscription()
    }

    try {
      const formData = new FormData()
      formData.append("file", audioBlob, "audio.webm")
      formData.append("model", "whisper-1")
      formData.append("language", "en") // You can make this configurable
      formData.append("response_format", "json")

      const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Whisper API error: ${response.status}`)
      }

      const result = await response.json()

      return {
        text: result.text,
        language: result.language,
      }
    } catch (error) {
      console.error("Whisper transcription failed:", error)
      // Fallback to mock data
      return this.getMockTranscription()
    }
  }

  async evaluateContent(title: string, subject: string, transcript: string): Promise<GPTEvaluationResult> {
    const apiKey = this.getApiKey()

    if (!apiKey) {
      // Return mock data if no API key
      return this.getMockEvaluation(title, subject, transcript)
    }

    try {
      const prompt = `You are an AI tutor evaluating a student's voice explanation. Please analyze the following:

Title: ${title}
Subject: ${subject}
Transcript: ${transcript}

Please provide:
1. A completeness score (0-100) based on how well the student explained the topic
2. A follow-up question to help them think deeper
3. 3-5 relevant tags for this content
4. Brief feedback on their explanation

Respond in JSON format:
{
  "completenessScore": number,
  "aiPrompt": "string",
  "suggestedTags": ["tag1", "tag2", "tag3"],
  "feedback": "string"
}`

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      })

      if (!response.ok) {
        throw new Error(`GPT API error: ${response.status}`)
      }

      const result = await response.json()
      const content = result.choices[0].message.content

      try {
        const evaluation = JSON.parse(content)
        return {
          completenessScore: Math.min(100, Math.max(0, evaluation.completenessScore)),
          aiPrompt: evaluation.aiPrompt,
          suggestedTags: evaluation.suggestedTags || [],
          feedback: evaluation.feedback,
        }
      } catch (parseError) {
        console.error("Failed to parse GPT response:", parseError)
        return this.getMockEvaluation(title, subject, transcript)
      }
    } catch (error) {
      console.error("GPT evaluation failed:", error)
      // Fallback to mock data
      return this.getMockEvaluation(title, subject, transcript)
    }
  }

  private getMockTranscription(): TranscriptionResult {
    return {
      text: "This is a mock transcript. The actual transcript would be generated using Whisper API when you provide your OpenAI API key in settings.",
      confidence: 0.95,
      language: "en",
    }
  }

  private getMockEvaluation(title: string, subject: string, transcript: string): GPTEvaluationResult {
    const score = Math.floor(Math.random() * 30) + 60 // 60-90%

    const mockTags = [subject, "Study Notes", "Review"]
    if (title.toLowerCase().includes("war")) mockTags.push("Conflict", "Politics")
    if (title.toLowerCase().includes("photo")) mockTags.push("Science", "Biology")
    if (title.toLowerCase().includes("math")) mockTags.push("Mathematics", "Problem Solving")

    return {
      completenessScore: score,
      aiPrompt: `Based on your explanation of ${title}, can you elaborate on one aspect you mentioned that could be explored further?`,
      suggestedTags: [...new Set(mockTags)],
      feedback:
        score >= 80
          ? "Great explanation! Your understanding seems comprehensive."
          : score >= 60
            ? "Good start! There's room to expand on some concepts."
            : "This is a foundation. Consider adding more detail and examples.",
    }
  }
}

// Export singleton instance
export const whisperService = new WhisperService()
