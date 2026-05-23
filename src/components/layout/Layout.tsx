import { type ReactNode, useRef, useState, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useQueryClient } from '@tanstack/react-query'
import { Mic } from 'lucide-react'
import { TopNav } from './TopNav'
import { BottomNav } from './BottomNav'
import { Sidebar } from './Sidebar'
import { NavigationDrawer } from '@/components/navigation/NavigationDrawer'
import { SearchOverlay } from '@/components/search/SearchOverlay'
import { TafsirPanel } from '@/components/quran/TafsirPanel'
import { RecitationSheet } from '@/components/quran/RecitationSheet'
import { ContinuousControlBar } from '@/components/quran/ContinuousControlBar'
import { AudioPlayerBar } from '@/components/audio/AudioPlayerBar'
import { Toast } from '@/components/ui/Toast'
import { SettingsDrawer } from '@/components/settings/SettingsDrawer'
import { useQuranStore } from '@/stores/quranStore'
import { useAudioStore } from '@/stores/audioStore'
import { useAudioPlayer } from '@/hooks/useAudioPlayer'
import { cn } from '@/components/ui/cn'

// Always-mounted so audio element exists before user taps play (preserves gesture context)
function AudioEngine() {
  useAudioPlayer()
  return null
}

interface LayoutProps {
  children: ReactNode
  showTopNav?: boolean
}

const PULL_THRESHOLD = 72

export function Layout({ children, showTopNav = true }: LayoutProps) {
  const {
    zenMode, readingMode,
    activeRecitationVerse, closeRecitation,
    activeContinuousRecitation, closeContinuousRecitation,
  } = useQuranStore()
  const { audioUrl } = useAudioStore()
  const location = useLocation()
  const qc = useQueryClient()

  const isReaderRoute = location.pathname.startsWith('/read')
  const showMicFab = isReaderRoute && !zenMode && !activeRecitationVerse && !activeContinuousRecitation

  const touchStartY = useRef(0)
  const [pullDist, setPullDist] = useState(0)
  const [refreshing, setRefreshing] = useState(false)

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY
  }, [])

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (window.scrollY > 0 || refreshing) return
    const dist = Math.max(0, e.touches[0].clientY - touchStartY.current)
    setPullDist(Math.min(dist * 0.4, PULL_THRESHOLD))
  }, [refreshing])

  const onTouchEnd = useCallback(async () => {
    if (pullDist >= PULL_THRESHOLD) {
      setRefreshing(true)
      const path = location.pathname
      if (path.startsWith('/hifz')) {
        await qc.invalidateQueries({ queryKey: ['hifz'] })
      } else if (path.startsWith('/read')) {
        await qc.invalidateQueries({ queryKey: ['quran'] })
      } else if (path.startsWith('/tasbih')) {
        await qc.invalidateQueries({ queryKey: ['gamification'] })
      } else if (path.startsWith('/profile')) {
        await qc.invalidateQueries({ queryKey: ['auth'] })
        await qc.invalidateQueries({ queryKey: ['gamification'] })
      } else {
        await qc.invalidateQueries()
      }
      setTimeout(() => { setRefreshing(false); setPullDist(0) }, 800)
    } else {
      setPullDist(0)
    }
  }, [pullDist, qc, location.pathname])

  return (
    <div
      className="flex min-h-dvh bg-bg-primary relative"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <AudioEngine />
      <Sidebar />

      <div className="flex flex-col flex-1 min-w-0 lg:max-w-3xl lg:mx-auto w-full">
        <AnimatePresence>
          {showTopNav && !zenMode && (
            <motion.div
              key="topnav"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <TopNav />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pull-to-refresh indicator */}
        {(pullDist > 0 || refreshing) && (
          <div
            className="flex items-center justify-center overflow-hidden transition-all"
            style={{ height: refreshing ? 40 : pullDist * (40 / PULL_THRESHOLD) }}
          >
            <span className={cn(
              'w-5 h-5 rounded-full border-2 border-accent border-t-transparent',
              refreshing ? 'animate-spin' : 'opacity-60'
            )} />
          </div>
        )}

        <main
          className={cn(
            'flex-1',
            !zenMode && !audioUrl && 'pb-20 lg:pb-0',
            !!audioUrl && !zenMode && 'pb-20 lg:pb-4'
          )}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.18 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>

        <AnimatePresence>
          {!zenMode && !audioUrl && (
            <motion.div
              key="bottomnav"
              initial={{ y: 64, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 64, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <BottomNav />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {!zenMode && audioUrl && (
            <motion.div
              key="audioplayer"
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <AudioPlayerBar />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <NavigationDrawer />
      <SettingsDrawer />
      <SearchOverlay />
      <TafsirPanel />
      <Toast />

      {/* Floating mic FAB — faqat reader scroll modeda */}
      <AnimatePresence>
        {showMicFab && (
          <motion.button
            key="mic-fab"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => window.dispatchEvent(new CustomEvent('open-recitation-fab'))}
            className="fixed bottom-24 right-5 z-40 w-14 h-14 rounded-full bg-accent shadow-lg shadow-accent/30 flex items-center justify-center text-bg-primary"
            title="Qiroat mashqi"
          >
            <Mic size={22} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Single-verse recitation sheet */}
      {activeRecitationVerse && (
        <RecitationSheet
          verse={{
            id: activeRecitationVerse.verseNumber,
            number: activeRecitationVerse.verseNumber,
            text_arabic: activeRecitationVerse.arabicText,
            surah_number: activeRecitationVerse.surahNumber,
            text_transliteration: '',
            page_number: 0,
            juz_number: 0,
            hizb_quarter: 0,
            is_sajda: false,
            global_index: 0,
            translations: [],
          }}
          onClose={closeRecitation}
        />
      )}

      {/* Continuous recitation control bar — inline on reader */}
      <AnimatePresence>
        {activeContinuousRecitation && <ContinuousControlBar />}
      </AnimatePresence>
    </div>
  )
}
