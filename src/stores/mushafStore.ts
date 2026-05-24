import { create } from 'zustand'

interface MushafState {
  dummy: null
}

export const useMushafStore = create<MushafState>()(() => ({ dummy: null }))
