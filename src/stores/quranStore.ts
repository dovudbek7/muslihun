import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Language, ReadingMode } from '@/types/quran'
import { FONT_SIZE_DEFAULT, type ReciterId } from '@/constants/quran'

interface QuranState {
  currentSurah: number
  currentVerse: number
  currentPage: number
  currentJuz: number
  readingMode: ReadingMode
  language: Language
  fontSize: number
  tajweedMode: boolean
  arabicOnly: boolean
  zenMode: boolean
  showTransliteration: boolean
  showInlineTafsir: boolean
  reciterIdentifier: ReciterId
  activeTafsirVerse: { surah: number; verse: number } | null
  highlightedVerse: number | null
  mushafFullscreen: boolean
  activeRecitationVerse: { surahNumber: number; verseNumber: number; arabicText: string } | null
  activeContinuousRecitation: {
    surahNumber: number
    verses: Array<{ id: number; number: number; text_arabic: string }>
    startVerseIndex: number
  } | null
  continuousActiveVerseIdx: number

  setHighlightedVerse: (n: number | null) => void
  setCurrentSurah: (n: number) => void
  setCurrentVerse: (n: number) => void
  setCurrentPage: (n: number) => void
  setCurrentJuz: (n: number) => void
  setReadingMode: (mode: ReadingMode) => void
  setLanguage: (lang: Language) => void
  setFontSize: (size: number) => void
  toggleTajweedMode: () => void
  toggleArabicOnly: () => void
  toggleZenMode: () => void
  toggleTransliteration: () => void
  toggleInlineTafsir: () => void
  setReciterIdentifier: (id: ReciterId) => void
  openTafsir: (surah: number, verse: number) => void
  closeTafsir: () => void
  navigateTo: (surah: number, verse?: number, page?: number) => void
  toggleMushafFullscreen: () => void
  openRecitation: (surahNumber: number, verseNumber: number, arabicText: string) => void
  closeRecitation: () => void
  openContinuousRecitation: (
    surahNumber: number,
    verses: Array<{ id: number; number: number; text_arabic: string }>,
    startVerseIndex: number
  ) => void
  closeContinuousRecitation: () => void
  setContinuousActiveVerseIdx: (idx: number) => void
}

export const useQuranStore = create<QuranState>()(
  persist(
    (set) => ({
      currentSurah: 1,
      currentVerse: 1,
      currentPage: 1,
      currentJuz: 1,
      readingMode: 'scroll',
      language: 'en',
      fontSize: FONT_SIZE_DEFAULT,
      tajweedMode: false,
      arabicOnly: false,
      zenMode: false,
      showTransliteration: false,
      showInlineTafsir: false,
      reciterIdentifier: 'ar.alafasy',
      activeTafsirVerse: null,
      highlightedVerse: null,
      mushafFullscreen: false,
      activeRecitationVerse: null,
      activeContinuousRecitation: null,
      continuousActiveVerseIdx: 0,

      setHighlightedVerse: (n) => set({ highlightedVerse: n }),
      setCurrentSurah: (n) => set({ currentSurah: n }),
      setCurrentVerse: (n) => set({ currentVerse: n }),
      setCurrentPage: (n) => set({ currentPage: n }),
      setCurrentJuz: (n) => set({ currentJuz: n }),
      setReadingMode: (mode) => set({ readingMode: mode }),
      setLanguage: (lang) => set({ language: lang }),
      setFontSize: (size) => set({ fontSize: size }),
      toggleTajweedMode: () => set((s) => ({ tajweedMode: !s.tajweedMode })),
      toggleArabicOnly: () => set((s) => ({ arabicOnly: !s.arabicOnly })),
      toggleZenMode: () => set((s) => ({ zenMode: !s.zenMode })),
      toggleTransliteration: () => set((s) => ({ showTransliteration: !s.showTransliteration })),
      toggleInlineTafsir: () => set((s) => ({ showInlineTafsir: !s.showInlineTafsir })),
      setReciterIdentifier: (id) => set({ reciterIdentifier: id }),
      openTafsir: (surah, verse) => set({ activeTafsirVerse: { surah, verse } }),
      closeTafsir: () => set({ activeTafsirVerse: null }),
      toggleMushafFullscreen: () => set((s) => ({ mushafFullscreen: !s.mushafFullscreen })),
      navigateTo: (surah, verse = 1, page) =>
        set({ currentSurah: surah, currentVerse: verse, ...(page ? { currentPage: page } : {}) }),
      openRecitation: (surahNumber, verseNumber, arabicText) =>
        set({ activeRecitationVerse: { surahNumber, verseNumber, arabicText } }),
      closeRecitation: () => set({ activeRecitationVerse: null }),
      openContinuousRecitation: (surahNumber, verses, startVerseIndex) =>
        set({ activeContinuousRecitation: { surahNumber, verses, startVerseIndex }, continuousActiveVerseIdx: startVerseIndex }),
      closeContinuousRecitation: () => set({ activeContinuousRecitation: null, continuousActiveVerseIdx: 0 }),
      setContinuousActiveVerseIdx: (idx) => set({ continuousActiveVerseIdx: idx }),
    }),
    {
      name: 'muslihun-quran',
      partialize: (s) => ({
        currentSurah: s.currentSurah,
        currentVerse: s.currentVerse,
        currentPage: s.currentPage,
        readingMode: s.readingMode,
        language: s.language,
        fontSize: s.fontSize,
        tajweedMode: s.tajweedMode,
        arabicOnly: s.arabicOnly,
        showTransliteration: s.showTransliteration,
        showInlineTafsir: s.showInlineTafsir,
        reciterIdentifier: s.reciterIdentifier,
      }),
    }
  )
)
