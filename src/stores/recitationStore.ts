import { create } from 'zustand'
import { splitWords, wordsMatch } from '@/utils/arabicNormalize'

export type WordStatus = 'dim' | 'current' | 'correct' | 'wrong'
export type SessionStatus = 'idle' | 'listening' | 'paused' | 'finished'

export interface WordState {
  text: string
  status: WordStatus
}

interface RecitationState {
  sessionStatus: SessionStatus
  words: WordState[]
  currentIndex: number
  correctCount: number
  errorCount: number
  startSession: (ayahText: string) => void
  processWord: (recognized: string) => void
  pause: () => void
  resume: () => void
  reset: () => void
}

export const useRecitationStore = create<RecitationState>((set, get) => ({
  sessionStatus: 'idle',
  words: [],
  currentIndex: 0,
  correctCount: 0,
  errorCount: 0,

  startSession: (ayahText) => {
    const wordList = splitWords(ayahText)
    const words: WordState[] = wordList.map((text, i) => ({
      text,
      status: i === 0 ? 'current' : 'dim',
    }))
    set({ sessionStatus: 'listening', words, currentIndex: 0, correctCount: 0, errorCount: 0 })
  },

  processWord: (recognized) => {
    const { words, currentIndex, correctCount, errorCount } = get()
    if (!words.length) return

    const current = words[currentIndex]
    if (!current || current.status === 'wrong') return

    const newWords = [...words]

    if (wordsMatch(recognized, current.text)) {
      newWords[currentIndex] = { ...current, status: 'correct' }
      const next = currentIndex + 1
      if (next >= words.length) {
        set({ words: newWords, currentIndex: next, correctCount: correctCount + 1, sessionStatus: 'finished' })
      } else {
        newWords[next] = { ...newWords[next], status: 'current' }
        set({ words: newWords, currentIndex: next, correctCount: correctCount + 1 })
      }
    } else {
      newWords[currentIndex] = { ...current, status: 'wrong' }
      set({ words: newWords, errorCount: errorCount + 1 })
      setTimeout(() => {
        const { words: w, currentIndex: ci } = get()
        if (w[ci]?.status === 'wrong') {
          const updated = [...w]
          updated[ci] = { ...updated[ci], status: 'current' }
          set({ words: updated })
        }
      }, 1500)
    }
  },

  pause: () => set({ sessionStatus: 'paused' }),
  resume: () => set({ sessionStatus: 'listening' }),
  reset: () => set({ sessionStatus: 'idle', words: [], currentIndex: 0, correctCount: 0, errorCount: 0 }),
}))
