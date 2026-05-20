import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Clock, Flame, ChevronRight, Star } from 'lucide-react'
import { useQuranStore } from '@/stores/quranStore'
import { useAuthStore } from '@/stores/authStore'
import { useSurahs } from '@/api/quran'
import { useStreak } from '@/api/gamification'
import { usePrayerCountdown, formatCountdown } from '@/hooks/usePrayerTimes'
import { buildRoute } from '@/constants/routes'
import { cn } from '@/components/ui/cn'

const LAST_READ_SURAHS = [1, 2, 36, 67, 78]

export function Home() {
  const navigate = useNavigate()
  const { currentSurah, currentVerse, language, navigateTo } = useQuranStore()
  const { user } = useAuthStore()
  const { data: surahs } = useSurahs(language)
  const { data: streak } = useStreak()
  const { countdown } = usePrayerCountdown()

  const currentSurahData = surahs?.find(s => s.number === currentSurah)

  function handleContinueReading() {
    navigate(buildRoute.surah(currentSurah))
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="px-4 py-6 space-y-6"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-text-muted text-sm">Assalamu alaykum</p>
          <h1 className="text-text-primary font-semibold text-xl mt-0.5">
            {user?.username || 'Mehmon'}
          </h1>
        </div>
        {streak && streak.current_streak > 0 && (
          <div className="flex items-center gap-1.5 bg-amber-400/10 border border-amber-400/30 rounded-xl px-3 py-1.5">
            <Flame size={14} className="text-amber-400" />
            <span className="text-amber-400 font-semibold text-sm">
              {streak.current_streak}
            </span>
          </div>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/20 rounded-2xl p-5"
        onClick={handleContinueReading}
      >
        <div className="flex items-center gap-2 mb-3">
          <BookOpen size={15} className="text-accent" />
          <span className="text-accent text-xs font-medium uppercase tracking-wider">
            O'qishni davom ettirish
          </span>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-text-primary font-semibold text-lg">
              {currentSurahData?.name_en || `Sura ${currentSurah}`}
            </p>
            <p className="text-text-muted text-sm mt-0.5">
              {currentSurahData?.name_arabic}
            </p>
            <p className="text-text-muted text-xs mt-1">
              {currentSurah}:{currentVerse} oyat
            </p>
          </div>
          <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
            <ChevronRight size={18} className="text-accent" />
          </div>
        </div>
      </motion.div>

      {countdown && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-bg-card border border-border-subtle rounded-2xl p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock size={15} className="text-text-muted" />
              <span className="text-text-secondary text-sm">
                Keyingi namoz: <span className="text-accent font-medium">{countdown.name}</span>
              </span>
            </div>
            <span className="text-text-primary font-mono text-sm font-medium">
              {formatCountdown(countdown.seconds_remaining)}
            </span>
          </div>
        </motion.div>
      )}

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-text-primary font-semibold text-base">Suralar</h2>
          <button
            onClick={() => navigate(buildRoute.surah(1))}
            className="text-accent text-sm"
          >
            Barchasi
          </button>
        </div>
        <div className="space-y-2">
          {surahs?.slice(0, 10).map((surah, i) => (
            <motion.button
              key={surah.number}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * i }}
              onClick={() => {
                navigateTo(surah.number)
                navigate(buildRoute.surah(surah.number))
              }}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left',
                'bg-bg-card border border-border-subtle hover:border-border hover:bg-bg-elevated'
              )}
            >
              <div className="w-8 h-8 rounded-lg bg-bg-elevated flex items-center justify-center text-xs font-semibold text-text-muted flex-shrink-0">
                {surah.number}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-text-primary text-sm font-medium">{surah.name_en}</p>
                <p className="text-text-muted text-xs">{surah.total_verses} oyat</p>
              </div>
              <p className="font-arabic text-text-arabic text-lg">{surah.name_arabic}</p>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
