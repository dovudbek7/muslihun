import { create } from 'zustand'
import type { PlaybackMode } from '@/types/audio'

interface AudioStore {
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
  audioUrl: string | null
  rangeStart: number | null
  rangeEnd: number | null

  play: (surah: number, verse: number | null, url: string) => void
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
  nextVerse: (totalVerses: number) => void
}

export const useAudioStore = create<AudioStore>((set, get) => ({
  isPlaying: false,
  isLoading: false,
  currentSurah: null,
  currentVerse: null,
  mode: 'single',
  reciterId: null,
  progress: 0,
  duration: 0,
  volume: 1,
  isMuted: false,
  audioUrl: null,
  rangeStart: null,
  rangeEnd: null,

  play: (surah, verse, url) =>
    set({ isPlaying: true, currentSurah: surah, currentVerse: verse, audioUrl: url, progress: 0 }),

  pause: () => set({ isPlaying: false }),
  resume: () => set({ isPlaying: true }),

  stop: () =>
    set({ isPlaying: false, progress: 0, currentSurah: null, currentVerse: null, audioUrl: null }),

  setProgress: (p) => set({ progress: p }),
  setDuration: (d) => set({ duration: d }),
  setVolume: (v) => set({ volume: v, isMuted: v === 0 }),
  toggleMute: () => set((s) => ({ isMuted: !s.isMuted })),
  setMode: (mode) => set({ mode }),
  setReciter: (id) => set({ reciterId: id }),
  setLoading: (loading) => set({ isLoading: loading }),
  setRange: (start, end) => set({ rangeStart: start, rangeEnd: end }),

  nextVerse: (totalVerses) => {
    const { currentVerse, mode } = get()
    if (!currentVerse) return
    if (mode === 'loop') return
    if (currentVerse < totalVerses) {
      set({ currentVerse: currentVerse + 1 })
    } else {
      set({ isPlaying: false })
    }
  },
}))
