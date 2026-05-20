export interface PaginatedResponse<T> {
  count: number
  total_pages: number
  current_page: number
  next: string | null
  previous: string | null
  results: T[]
}

export interface ApiError {
  error: string
  fields?: Record<string, string[]>
  status_code?: number
}

export interface SearchResult {
  type: 'surah' | 'verse'
  surah_number: number
  surah_name: string
  surah_name_arabic: string
  ayah: number | null
  page: number | null
  juz: number | null
  text_arabic?: string
  matched_text: string
  score: number
}

export interface SearchResponse {
  results: SearchResult[]
  total: number
  query: string
  cached?: boolean
}
