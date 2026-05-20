export type PlaybackMode = 'single' | 'surah' | 'range' | 'loop'

export interface Reciter {
  id: number
  identifier: string
  name_en: string
  name_ar: string
  style: 'murattal' | 'mujawwad' | 'muallim'
  image_url: string
  bitrate: number
  is_active: boolean
}

export interface VerseAudioInfo {
  surah_number: number
  verse_number: number
  reciter_id: number
  reciter_name: string
  audio_url: string
  global_index: number
}

export interface SurahAudioInfo {
  surah_number: number
  surah_name: string
  reciter: Reciter
  audio_url: string
  verse_urls?: string[]
}

export interface AudioPlayerState {
  isPlaying: boolean
  isLoading: boolean
  currentSurah: number | null
  currentVerse: number | null
  mode: PlaybackMode
  reciterId: number | null
  progress: number
  duration: number
  volume: number
  isMuted: boolean
}
