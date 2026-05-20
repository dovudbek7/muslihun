import { type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { TopNav } from './TopNav'
import { BottomNav } from './BottomNav'
import { NavigationDrawer } from '@/components/navigation/NavigationDrawer'
import { SearchOverlay } from '@/components/search/SearchOverlay'
import { TafsirPanel } from '@/components/quran/TafsirPanel'
import { AudioPlayerBar } from '@/components/audio/AudioPlayerBar'
import { Toast } from '@/components/ui/Toast'
import { useQuranStore } from '@/stores/quranStore'
import { useAudioStore } from '@/stores/audioStore'

interface LayoutProps {
  children: ReactNode
  showTopNav?: boolean
}

export function Layout({ children, showTopNav = true }: LayoutProps) {
  const { zenMode } = useQuranStore()
  const { audioUrl } = useAudioStore()

  return (
    <div className="flex flex-col min-h-dvh bg-bg-primary relative">
      {showTopNav && <TopNav />}

      <main
        className={cn(
          'flex-1',
          !zenMode && 'pb-20',
          !!audioUrl && !zenMode && 'pb-36'
        )}
      >
        <AnimatePresence mode="wait">
          {children}
        </AnimatePresence>
      </main>

      {!zenMode && <BottomNav />}
      {!zenMode && audioUrl && <AudioPlayerBar />}

      <NavigationDrawer />
      <SearchOverlay />
      <TafsirPanel />
      <Toast />
    </div>
  )
}

function cn(...args: (string | boolean | undefined)[]) {
  return args.filter(Boolean).join(' ')
}
