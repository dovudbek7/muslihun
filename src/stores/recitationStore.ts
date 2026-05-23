import { create } from 'zustand'
import { splitWords, wordsMatch } from '@/utils/arabicNormalize'

export type WordStatus = 'dim' | 'current' | 'correct' | 'wrong'
export type SessionStatus = 'idle' | 'listening' | 'paused' | 'finished'
export type DisplayMode = 'highlight' | 'reveal'

export interface WordState {
  text: string
  status: WordStatus
}

export interface LastError {
  recognized: string
  expected: string
}

interface RecitationState {
  sessionStatus: SessionStatus
  displayMode: DisplayMode
  words: WordState[]
  currentIndex: number
  correctCount: number
  errorCount: number
  lastError: LastError | null
  startSession: (ayahText: string) => void
  processWord: (recognized: string) => void
  pause: () => void
  resume: () => void
  reset: () => void
  setDisplayMode: (mode: DisplayMode) => void
}

export const useRecitationStore = create<RecitationState>((set, get) => ({
  sessionStatus: 'idle',
  displayMode: 'highlight',
  words: [],
  currentIndex: 0,
  correctCount: 0,
  errorCount: 0,
  lastError: null,

  setDisplayMode: (mode) => set({ displayMode: mode }),

  startSession: (ayahText) => {
    const { displayMode } = get()
    const wordList = splitWords(ayahText)
    const words: WordState[] = wordList.map((text, i) => ({
      text,
      status: i === 0 ? 'current' : 'dim',
    }))
    set({ sessionStatus: 'listening', words, currentIndex: 0, correctCount: 0, errorCount: 0, lastError: null, displayMode })
  },

  processWord: (recognized) => {
    const { words, currentIndex, correctCount, errorCount } = get()
    if (!words.length) return

    const current = words[currentIndex]
    if (!current) return

    const newWords = [...words]
    const wasWrong = current.status === 'wrong'

    if (wordsMatch(recognized, current.text)) {
      newWords[currentIndex] = { ...current, status: 'correct' }
      const next = currentIndex + 1
      if (next >= words.length) {
        set({ words: newWords, currentIndex: next, correctCount: correctCount + 1, sessionStatus: 'finished', lastError: null })
      } else {
        newWords[next] = { ...newWords[next], status: 'current' }
        set({ words: newWords, currentIndex: next, correctCount: correctCount + 1, lastError: null })
      }
    } else {
      newWords[currentIndex] = { ...current, status: 'wrong' }
      set({ words: newWords, errorCount: wasWrong ? errorCount : errorCount + 1, lastError: { recognized, expected: current.text } })
    }
  },

  pause: () => set({ sessionStatus: 'paused' }),
  resume: () => set({ sessionStatus: 'listening' }),
  reset: () => set({ sessionStatus: 'idle', words: [], currentIndex: 0, correctCount: 0, errorCount: 0, lastError: null }),
}))
