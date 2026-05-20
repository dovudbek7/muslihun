export type Language = 'en' | 'ru' | 'tr' | 'uz_latin' | 'uz_cyrillic'
export type ReadingMode = 'scroll' | 'mushaf'
export type RevelationType = 'meccan' | 'medinan'

export interface Translation {
  language: Language
  text: string
  source: string
}

export interface Tafsir {
  language: Language
  source: string
  content: string | null
}

export interface Verse {
  id: number
  number: number
  text_arabic: string
  text_transliteration: string
  page_number: number
  juz_number: number
  hizb_quarter: number
  is_sajda: boolean
  global_index: number
  translations: Translation[]
  tafsirs?: Tafsir[]
  translation?: string | null
}

export interface Surah {
  number: number
  name_arabic: string
  name_transliteration: string
  name_en: string
  name_ru: string
  name_tr: string
  revelation_type: RevelationType
  total_verses: number
  page_start: number
  page_end?: number
  verses?: Verse[]
}

export interface PageData {
  page_number: number
  verses: Verse[]
}

export interface JuzData {
  juz_number: number
  verses: Verse[]
}

export interface NavigationData {
  surahs: Surah[]
  juz: JuzBoundary[]
  total_pages: number
}

export interface JuzBoundary {
  juz_number: number
  surah_number: number
  verse_number: number
  page_number: number
}

export interface TafsirDetail {
  id: number
  verse_number: number
  surah_number: number
  surah_name: string
  text_arabic: string
  language: Language
  source: string
  content: string
}

export interface BookmarkItem {
  id: number
  verse: number
  surah_number: number
  verse_number: number
  text_arabic: string
  page_number: number
  color: 'gold' | 'green' | 'blue' | 'red'
  note: string
  created_at: string
}
