import type { Language, ReadingMode } from './quran'

export interface User {
  id: number
  email: string
  username: string
  avatar: string
  preferred_language: Language
  reading_mode: ReadingMode
  font_size: number
  tajweed_mode: boolean
  arabic_only: boolean
  zen_mode: boolean
  show_transliteration: boolean
  last_read_surah: number | null
  last_read_verse: number | null
  last_read_page: number | null
  created_at: string
  updated_at: string
}

export interface AuthTokens {
  access: string
  refresh: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  email: string
  username: string
  password: string
  password_confirm: string
  preferred_language?: Language
}

export interface LoginResponse {
  access: string
  refresh: string
  user: User
}

export interface RegisterResponse {
  tokens: AuthTokens
  user: User
}

export interface UserPreferences {
  preferred_language?: Language
  reading_mode?: ReadingMode
  font_size?: number
  tajweed_mode?: boolean
  arabic_only?: boolean
  zen_mode?: boolean
  show_transliteration?: boolean
}
