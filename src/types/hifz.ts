export type HifzMode = 'blind' | 'hint'
export type HifzStatus = 'new' | 'learning' | 'memorized' | 'weak'
export type ErrorType = 'RED' | 'YELLOW'

export interface HifzSession {
  id: number
  surah: number
  surah_name: string
  mode: HifzMode
  started_at: string
  ended_at: string | null
  verses_attempted: number
  verses_correct: number
  accuracy: number
}

export interface HifzProgress {
  id: number
  surah_number: number
  verse_number: number
  text_arabic: string
  page_number: number
  status: HifzStatus
  ease_factor: number
  interval_days: number
  repetitions: number
  next_review: string
  last_reviewed: string | null
  total_reviews: number
  total_errors: number
  days_until_review: number
}

export interface ErrorLog {
  id: number
  surah_number: number
  verse_number: number
  text_arabic: string
  error_type: ErrorType
  notes: string
  created_at: string
}

export interface SurahProgressStats {
  surah_number: number
  surah_name: string
  total_verses: number
  memorized: number
  learning: number
  weak: number
  new: number
  completion_percent: number
}

export interface ErrorStats {
  total_red: number
  total_yellow: number
  due_for_review: number
  most_problematic_verses: HifzProgress[]
}

export interface DailyReview {
  date: string
  count: number
  label: string
}

export interface SurahTopEntry {
  surah_number: number
  surah_name: string
  total_verses: number
  memorized: number
  percent: number
}

export interface HifzDashboard {
  status_counts: { memorized: number; learning: number; weak: number; new: number }
  total_in_progress: number
  due_count: number
  daily_reviews: DailyReview[]
  top_surahs: SurahTopEntry[]
}

export interface TranscribeWord {
  text: string
  correct: boolean
}

export interface TranscribeResult {
  transcription: string
  match_percent: number
  words: TranscribeWord[]
  verse_text: string
}
