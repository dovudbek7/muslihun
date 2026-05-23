import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type MushafMode = 'vertical' | 'page' | 'zoom'

interface MushafState {
  mode: MushafMode
  zoom: number
  setMode: (mode: MushafMode) => void
  setZoom: (zoom: number) => void
}

export const useMushafStore = create<MushafState>()(
  persist(
    (set) => ({
      mode: 'page',
      zoom: 1,
      setMode: (mode) => set({ mode, zoom: 1 }),
      setZoom: (zoom) => set({ zoom }),
    }),
    {
      name: 'muslihun-mushaf',
      partialize: (s) => ({ mode: s.mode }),
    }
  )
)
