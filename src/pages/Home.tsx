import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Clock, Flame, ChevronRight, Brain, Hash, Search, Play } from 'lucide-react'
import { useQuranStore } from '@/stores/quranStore'
import { useAuthStore } from '@/stores/authStore'
import { useAudioStore } from '@/stores/audioStore'
import { useSurahs } from '@/api/quran'
import { useStreak } from '@/api/gamification'
import { usePrayerCountdown, formatCountdown } from '@/hooks/usePrayerTimes'
import { buildRoute } from '@/constants/routes'
import { cn } from '@/components/ui/cn'

const SECTIONS = [
  { to: '/read/surah/1', icon: BookOpen, label: "Qur'on", color: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/20 text-emerald-400' },
  { to: '/hifz', icon: Brain, label: 'Hifz', color: 'from-blue-500/20 to-blue-600/10 border-blue-500/20 text-blue-400' },
  { to: '/tasbih', icon: Hash, label: 'Tasbih', color: 'from-purple-500/20 to-purple-600/10 border-purple-500/20 text-purple-400' },
  { to: '/search', icon: Search, label: 'Qidiruv', color: 'from-amber-500/20 to-amber-600/10 border-amber-500/20 text-amber-400' },
]

const CDN_RECITER = 'ar.alafasy'

export function Home() {
  const navigate = useNavigate()
  const { currentSurah, currentVerse, language, navigateTo } = useQuranStore()
  const { user } = useAuthStore()
  const { play } = useAudioStore()
  const { data: surahs } = useSurahs(language)
  const { data: streak } = useStreak()
  const { countdown } = usePrayerCountdown()

  const currentSurahData = surahs?.find(s => s.number === currentSurah)

  function handleSurahPlay(e: React.MouseEvent, surahNumber: number) {
    e.stopPropagation()
    const url = `https://cdn.islamic.network/quran/audio-surah/128/${CDN_RECITER}/${surahNumber}.mp3`
    play(surahNumber, null, url)
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

      {/* Sections grid */}
      <div className="grid grid-cols-2 gap-3">
        {SECTIONS.map(({ to, icon: Icon, label, color }, i) => (
          <motion.button
            key={to}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i }}
            onClick={() => navigate(to)}
            className={cn(
              'flex flex-col items-center justify-center gap-3 py-5 rounded-2xl border bg-gradient-to-br transition-all active:scale-95',
              color
            )}
          >
            <Icon size={26} strokeWidth={1.8} />
            <span className="text-sm font-semibold">{label}</span>
          </motion.button>
        ))}
      </div>

      {/* Continue reading */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/20 rounded-2xl p-5 cursor-pointer"
        onClick={() => navigate(buildRoute.surah(currentSurah))}
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
              {currentSurahData?.name_transliteration || `Sura ${currentSurah}`}
            </p>
            <p className="text-text-muted text-xs mt-1 font-arabic text-base">
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

      {/* Surah list */}
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
            <motion.div
              key={surah.number}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.04 * i }}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl transition-colors',
                'bg-bg-card border border-border-subtle hover:border-border hover:bg-bg-elevated cursor-pointer'
              )}
              onClick={() => {
                navigateTo(surah.number)
                navigate(buildRoute.surah(surah.number))
              }}
            >
              <div className="w-8 h-8 rounded-lg bg-bg-elevated flex items-center justify-center text-xs font-semibold text-text-muted flex-shrink-0">
                {surah.number}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-text-primary text-sm font-medium">{surah.name_transliteration}</p>
                <p className="text-text-muted text-xs">{surah.total_verses} oyat</p>
              </div>
              <p className="font-arabic text-text-arabic text-lg">{surah.name_arabic}</p>
              <button
                onClick={(e) => handleSurahPlay(e, surah.number)}
                className="p-2 rounded-lg text-text-muted hover:text-accent hover:bg-accent/10 transition-colors flex-shrink-0"
              >
                <Play size={14} />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
