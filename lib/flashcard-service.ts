export interface FlashcardData {
  id: string
  question: string
  answer: string
  difficulty: "easy" | "medium" | "hard"
  keyPoints: string[]
  examples?: string[]
  relatedConcepts?: string[]
}

export class FlashcardService {
  private apiKey: string | null = null

  constructor() {
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

  async generateFlashcards(title: string, subject: string, transcript: string): Promise<FlashcardData[]> {
    const apiKey = this.getApiKey()

    // If no API key, return enhanced mock data immediately
    if (!apiKey) {
      console.log("No OpenAI API key found - using enhanced mock flashcards")
      return this.getMockFlashcards(title, subject, transcript)
    }

    try {
      console.log("Generating AI flashcards with OpenAI...")

      const prompt = `You are an expert educator creating study flashcards. Based on this voice note transcript, create 4-6 high-quality flashcards that test deep understanding.

Title: ${title}
Subject: ${subject}
Transcript: ${transcript}

Create flashcards that:
1. Test conceptual understanding, not just memorization
2. Include detailed, comprehensive answers (3-5 sentences each)
3. Cover different difficulty levels (easy, medium, hard)
4. Include key points, examples, and related concepts
5. Use active recall techniques
6. Are directly relevant to the transcript content

Respond in JSON format:
{
  "flashcards": [
    {
      "id": "unique_id",
      "question": "Clear, specific question based on the transcript",
      "answer": "Detailed, comprehensive answer with explanations",
      "difficulty": "easy|medium|hard",
      "keyPoints": ["point1", "point2", "point3"],
      "examples": ["example1", "example2"],
      "relatedConcepts": ["concept1", "concept2"]
    }
  ]
}`

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content:
                "You are an expert educator who creates high-quality study materials. Focus on deep understanding and practical application. Always respond with valid JSON.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 2500,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`OpenAI API error: ${response.status} - ${errorText}`)
        throw new Error(`GPT API error: ${response.status}`)
      }

      const result = await response.json()
      const content = result.choices[0].message.content

      try {
        // Clean the content in case there are markdown code blocks
        const cleanContent = content
          .replace(/```json\n?/g, "")
          .replace(/```\n?/g, "")
          .trim()
        const parsed = JSON.parse(cleanContent)

        const flashcards = parsed.flashcards.map((card: any, index: number) => ({
          ...card,
          id: card.id || `ai-card-${Date.now()}-${index}`,
        }))

        console.log(`Successfully generated ${flashcards.length} AI flashcards`)
        return flashcards
      } catch (parseError) {
        console.error("Failed to parse GPT flashcard response:", parseError)
        console.error("Raw response:", content)
        return this.getMockFlashcards(title, subject, transcript)
      }
    } catch (error) {
      console.error("GPT flashcard generation failed:", error)
      return this.getMockFlashcards(title, subject, transcript)
    }
  }

  async evaluateSpokenAnswer(
    question: string,
    correctAnswer: string,
    spokenAnswer: string,
    keyPoints: string[],
  ): Promise<{
    accuracy: number
    completeness: number
    feedback: string
    missedPoints: string[]
    strengths: string[]
  }> {
    const apiKey = this.getApiKey()

    // If no API key, return enhanced mock evaluation
    if (!apiKey) {
      console.log("No OpenAI API key found - using mock evaluation")
      return this.getMockEvaluation(spokenAnswer, keyPoints)
    }

    try {
      console.log("Evaluating answer with OpenAI...")

      const prompt = `You are an AI tutor evaluating a student's spoken answer to a flashcard question.

Question: ${question}
Correct Answer: ${correctAnswer}
Key Points: ${keyPoints.join(", ")}
Student's Spoken Answer: "${spokenAnswer}"

Evaluate the student's answer and provide:
1. Accuracy score (0-100): How factually correct is the answer?
2. Completeness score (0-100): How well did they cover the key points?
3. Detailed feedback with specific suggestions for improvement
4. List of missed key points (if any)
5. List of strengths in their answer

Be encouraging but constructive. Respond in JSON format:
{
  "accuracy": number,
  "completeness": number,
  "feedback": "detailed feedback string",
  "missedPoints": ["point1", "point2"],
  "strengths": ["strength1", "strength2"]
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
              role: "system",
              content:
                "You are a helpful AI tutor who provides constructive feedback on student answers. Always respond with valid JSON.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.3,
          max_tokens: 800,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`OpenAI API error: ${response.status} - ${errorText}`)
        throw new Error(`GPT API error: ${response.status}`)
      }

      const result = await response.json()
      const content = result.choices[0].message.content

      try {
        // Clean the content in case there are markdown code blocks
        const cleanContent = content
          .replace(/```json\n?/g, "")
          .replace(/```\n?/g, "")
          .trim()
        const evaluation = JSON.parse(cleanContent)

        console.log("Successfully evaluated answer with AI")
        return evaluation
      } catch (parseError) {
        console.error("Failed to parse evaluation response:", parseError)
        console.error("Raw response:", content)
        return this.getMockEvaluation(spokenAnswer, keyPoints)
      }
    } catch (error) {
      console.error("Answer evaluation failed:", error)
      return this.getMockEvaluation(spokenAnswer, keyPoints)
    }
  }

  private getMockFlashcards(title: string, subject: string, transcript: string): FlashcardData[] {
    // Enhanced mock data with better answers based on the actual content
    const baseCards = [
      {
        id: "mock-1",
        question: `What is the main concept discussed in "${title}"?`,
        answer: `The main concept of ${title} in ${subject} involves understanding the fundamental principles and mechanisms at work. ${transcript?.substring(0, 100) || "This topic covers essential theoretical foundations and practical applications."} The concept encompasses multiple interconnected elements that work together to create a comprehensive understanding of the subject matter. Understanding this concept is crucial for grasping the broader implications within ${subject}.`,
        difficulty: "easy" as const,
        keyPoints: ["Core definition and principles", "Main theoretical framework", "Basic context and importance"],
        examples: [`Real-world application in ${subject}`, "Practical demonstration of concept"],
        relatedConcepts: [subject, "Foundational concepts", "Basic theory"],
      },
      {
        id: "mock-2",
        question: `How does the process or mechanism described in "${title}" actually work?`,
        answer: `The process described in ${title} operates through a systematic sequence of steps and interactions. Each stage builds upon the previous one, creating a cascade of effects that ultimately achieve the desired outcome. Key factors that influence this process include environmental conditions, timing, and the presence of necessary components or catalysts. The mechanism involves both direct and indirect pathways that work together to produce the final result.`,
        difficulty: "medium" as const,
        keyPoints: ["Step-by-step process breakdown", "Key influencing factors", "Cause and effect relationships"],
        examples: ["Detailed process example", "Step-by-step walkthrough", "Real-world demonstration"],
        relatedConcepts: ["Process analysis", "Systems thinking", "Applied theory"],
      },
      {
        id: "mock-3",
        question: `What are the broader implications and connections of "${title}" within ${subject} and related fields?`,
        answer: `The implications of ${title} extend far beyond its immediate scope, connecting to numerous other concepts within ${subject} and related fields. These connections form a complex web of understanding that demonstrates the interconnected nature of knowledge in this domain. The broader implications include theoretical advances, practical applications, and potential future developments. This concept also influences research methodologies and approaches in adjacent fields.`,
        difficulty: "hard" as const,
        keyPoints: ["Broader theoretical implications", "Interdisciplinary connections", "Future research directions"],
        examples: ["Cross-field applications", "Advanced case studies", "Research implications"],
        relatedConcepts: ["Advanced theory", "Interdisciplinary studies", "Future research"],
      },
      {
        id: "mock-4",
        question: `What are the key advantages and limitations of the approach discussed in "${title}"?`,
        answer: `The approach outlined in ${title} offers several significant advantages including efficiency, reliability, and broad applicability across different contexts. However, it also has important limitations such as specific conditions required for optimal performance, potential constraints in certain environments, and areas where alternative approaches might be more suitable. Understanding both strengths and weaknesses is essential for proper application and knowing when to consider alternative methods.`,
        difficulty: "medium" as const,
        keyPoints: [
          "Main advantages and benefits",
          "Key limitations and constraints",
          "Comparative analysis with alternatives",
        ],
        examples: ["Advantage scenarios", "Limitation examples", "Comparative case studies"],
        relatedConcepts: ["Comparative analysis", "Critical thinking", "Evaluation methods"],
      },
      {
        id: "mock-5",
        question: `How would you apply the concepts from "${title}" to solve a real-world problem in ${subject}?`,
        answer: `Applying the concepts from ${title} to real-world problems requires a systematic approach that begins with problem identification and analysis. The key is to map the theoretical principles to practical constraints and opportunities, then develop a step-by-step implementation strategy that accounts for real-world variables and potential obstacles. This application process involves adapting the core concepts to specific contexts while maintaining their essential principles and effectiveness.`,
        difficulty: "hard" as const,
        keyPoints: [
          "Problem analysis and identification",
          "Practical application strategies",
          "Implementation considerations",
        ],
        examples: ["Real-world scenario", "Problem-solving case study", "Implementation example"],
        relatedConcepts: ["Applied learning", "Problem-solving", "Practical implementation"],
      },
    ]

    // Return 3-5 cards randomly selected from the base set
    const shuffled = baseCards.sort(() => Math.random() - 0.5)
    return shuffled.slice(0, 3 + Math.floor(Math.random() * 3)) // 3-5 cards
  }

  private getMockEvaluation(spokenAnswer: string, keyPoints: string[]) {
    const accuracy = 70 + Math.random() * 25 // 70-95%
    const completeness = 60 + Math.random() * 30 // 60-90%

    const strengths = [
      "Clear articulation of main concepts",
      "Good use of subject-specific terminology",
      "Logical flow of ideas",
      "Relevant examples provided",
      "Strong understanding of core principles",
      "Good connection between concepts",
    ]

    const possibleMissedPoints = [
      "Could elaborate more on the underlying mechanisms",
      "Consider discussing alternative perspectives",
      "Include more specific examples",
      "Connect to broader theoretical framework",
      "Explain the practical implications",
      "Discuss potential limitations or exceptions",
    ]

    return {
      accuracy: Math.round(accuracy),
      completeness: Math.round(completeness),
      feedback: `Your answer demonstrates ${accuracy > 80 ? "strong" : accuracy > 65 ? "good" : "developing"} understanding of the core concepts. ${
        completeness > 75
          ? "You covered most of the key points effectively."
          : completeness > 60
            ? "You addressed several important aspects but could expand on some areas."
            : "Consider including more detail on the key concepts."
      } ${accuracy > 75 ? "Your explanation shows clear comprehension and good use of terminology." : "Focus on connecting ideas more explicitly and using precise terminology."} Keep practicing to strengthen your explanations and build confidence.`,
      missedPoints: possibleMissedPoints.slice(0, Math.floor(Math.random() * 2) + 1),
      strengths: strengths.slice(0, Math.floor(Math.random() * 2) + 2),
    }
  }
}

// Export singleton instance
export const flashcardService = new FlashcardService()

// Export functions for compatibility
export const generateFlashcards = async (note: any) => {
  return flashcardService.generateFlashcards(note.title, note.subject, note.transcript || "")
}

export const evaluateAnswer = async (flashcard: any, userAnswer: string) => {
  return flashcardService.evaluateSpokenAnswer(
    flashcard.question,
    flashcard.answer,
    userAnswer,
    flashcard.keyPoints || [],
  )
}
