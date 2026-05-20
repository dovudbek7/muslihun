import { create } from 'zustand'
import type { PlaybackMode } from '@/types/audio'

interface AudioStore {
  isPlaying: boolean
  isLoading: boolean
  currentSurah: number | null
  currentVerse: number | null
  totalVerses: number
  mode: PlaybackMode
  reciterId: number | null
  progress: number
  duration: number
  volume: number
  isMuted: boolean
  audioUrl: string | null
  rangeStart: number | null
  rangeEnd: number | null

  play: (surah: number, verse: number | null, url: string, totalVerses?: number) => void
  pause: () => void
  resume: () => void
  stop: () => void
  setProgress: (p: number) => void
  setDuration: (d: number) => void
  setVolume: (v: number) => void
  toggleMute: () => void
  setMode: (mode: PlaybackMode) => void
  setReciter: (id: number) => void
  setLoading: (loading: boolean) => void
  setRange: (start: number, end: number) => void
  nextVerse: () => void
}

const CDN_VERSE_URL = (surah: number, verse: number) =>
  `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${String(surah).padStart(3, '0')}${String(verse).padStart(3, '0')}.mp3`

export const useAudioStore = create<AudioStore>((set, get) => ({
  isPlaying: false,
  isLoading: false,
  currentSurah: null,
  currentVerse: null,
  totalVerses: 0,
  mode: 'single',
  reciterId: null,
  progress: 0,
  duration: 0,
  volume: 1,
  isMuted: false,
  audioUrl: null,
  rangeStart: null,
  rangeEnd: null,

  play: (surah, verse, url, totalVerses = 0) =>
    set({ isPlaying: true, currentSurah: surah, currentVerse: verse, audioUrl: url, progress: 0, totalVerses }),

  pause: () => set({ isPlaying: false }),
  resume: () => set({ isPlaying: true }),

  stop: () =>
    set({ isPlaying: false, progress: 0, currentSurah: null, currentVerse: null, audioUrl: null, totalVerses: 0 }),

  setProgress: (p) => set({ progress: p }),
  setDuration: (d) => set({ duration: d }),
  setVolume: (v) => set({ volume: v, isMuted: v === 0 }),
  toggleMute: () => set((s) => ({ isMuted: !s.isMuted })),
  setMode: (mode) => set({ mode }),
  setReciter: (id) => set({ reciterId: id }),
  setLoading: (loading) => set({ isLoading: loading }),
  setRange: (start, end) => set({ rangeStart: start, rangeEnd: end }),

  nextVerse: () => {
    const { currentVerse, currentSurah, totalVerses } = get()
    if (!currentVerse || !currentSurah || totalVerses === 0) {
      set({ isPlaying: false })
      return
    }
    if (currentVerse < totalVerses) {
      const next = currentVerse + 1
      set({ currentVerse: next, audioUrl: CDN_VERSE_URL(currentSurah, next), isPlaying: true, progress: 0 })
    } else {
      set({ isPlaying: false })
    }
  },
}))
