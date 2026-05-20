import { create } from 'zustand'

type DrawerType = 'surah' | 'page' | 'juz' | 'settings' | 'reciter' | null

interface UIStore {
  activeDrawer: DrawerType
  isSearchOpen: boolean
  isTafsirOpen: boolean
  notification: { message: string; type: 'success' | 'error' | 'info' } | null

  openDrawer: (drawer: DrawerType) => void
  closeDrawer: () => void
  openSearch: () => void
  closeSearch: () => void
  toggleSearch: () => void
  openTafsir: () => void
  closeTafsir: () => void
  showNotification: (message: string, type?: 'success' | 'error' | 'info') => void
  clearNotification: () => void
}

export const useUIStore = create<UIStore>((set, get) => ({
  activeDrawer: null,
  isSearchOpen: false,
  isTafsirOpen: false,
  notification: null,

  openDrawer: (drawer) => set({ activeDrawer: drawer }),
  closeDrawer: () => set({ activeDrawer: null }),
  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),
  toggleSearch: () => set((s) => ({ isSearchOpen: !s.isSearchOpen })),
  openTafsir: () => set({ isTafsirOpen: true }),
  closeTafsir: () => set({ isTafsirOpen: false }),

  showNotification: (message, type = 'info') => {
    set({ notification: { message, type } })
    setTimeout(() => set({ notification: null }), 3000)
  },
  clearNotification: () => set({ notification: null }),
}))
