import { motion } from 'framer-motion'
import { BookOpen, Layers, AlignJustify, Search, Settings } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { PrayerCountdown, CurrentPrayer } from '@/components/prayer/PrayerCountdown'
import { useUIStore } from '@/stores/uiStore'
import { useQuranStore } from '@/stores/quranStore'
import { cn } from '@/components/ui/cn'

interface TopNavProps {
  showPrayer?: boolean
}

export function TopNav({ showPrayer = true }: TopNavProps) {
  const { openDrawer, toggleSearch } = useUIStore()
  const { currentSurah, currentPage, currentJuz, zenMode } = useQuranStore()
  const location = useLocation()
  const isReaderRoute = location.pathname.startsWith('/read')

  if (zenMode) return null

  return (
    <motion.header
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-40 bg-bg-primary/95 backdrop-blur-md border-b border-border-subtle safe-top"
    >
      <div className="flex items-center justify-between px-4 h-14">
        {showPrayer ? (
          <PrayerCountdown />
        ) : (
          <div className="w-28" />
        )}

        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none max-w-[45vw] sm:max-w-none">
          {isReaderRoute && (
            <>
              <NavPill
                label={`Sura ${currentSurah}`}
                icon={<BookOpen size={12} />}
                onClick={() => openDrawer('surah')}
              />
              <NavPill
                label={`${currentPage}-sahifa`}
                icon={<AlignJustify size={12} />}
                onClick={() => openDrawer('page')}
              />
              <NavPill
                label={`${currentJuz}-juz`}
                icon={<Layers size={12} />}
                onClick={() => openDrawer('juz')}
              />
            </>
          )}
        </div>

        {showPrayer ? (
          <CurrentPrayer />
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={toggleSearch}
              className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-elevated transition-colors"
              aria-label="Search"
            >
              <Search size={18} />
            </button>
          </div>
        )}
      </div>
    </motion.header>
  )
}

function NavPill({
  label,
  icon,
  onClick,
}: {
  label: string
  icon: React.ReactNode
  onClick: () => void
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.94 }}
      onClick={onClick}
      className={cn(
        'flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium',
        'bg-bg-elevated border border-border-subtle text-text-secondary',
        'hover:border-accent/30 hover:text-accent transition-all duration-200'
      )}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </motion.button>
  )
}
