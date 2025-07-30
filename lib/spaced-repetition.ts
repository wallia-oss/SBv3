// Spaced Repetition System (SRS) Algorithm
export const SRS_INTERVALS = [1, 3, 7, 14, 30, 90] // Days

export function calculateNextReviewDate(reviewCount: number, lastReviewDate?: Date): Date {
  const now = new Date()
  const intervalIndex = Math.min(reviewCount, SRS_INTERVALS.length - 1)
  const daysToAdd = SRS_INTERVALS[intervalIndex]

  const nextReview = new Date(now)
  nextReview.setDate(nextReview.getDate() + daysToAdd)

  return nextReview
}

export function isReviewDue(nextReviewDate?: Date): boolean {
  if (!nextReviewDate) return false
  return nextReviewDate <= new Date()
}

export function getReviewStatus(note: { isComplete: boolean; nextReviewDate?: Date }):
  | "complete"
  | "urgent"
  | "building" {
  if (note.isComplete) return "complete"
  if (note.nextReviewDate && isReviewDue(note.nextReviewDate)) return "urgent"
  return "building"
}
