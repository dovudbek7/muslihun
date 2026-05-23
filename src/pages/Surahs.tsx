import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Play, Mic } from 'lucide-react'
import { useSurahs } from '@/api/quran'
import { useQuranStore } from '@/stores/quranStore'
import { useAudioStore } from '@/stores/audioStore'
import { buildRoute } from '@/constants/routes'
import { cn } from '@/components/ui/cn'

const CDN_RECITER = 'ar.alafasy'

export function Surahs() {
  const navigate = useNavigate()
  const { language, navigateTo } = useQuranStore()
  const { play } = useAudioStore()
  const { data: surahs } = useSurahs(language)

  function handlePlay(e: React.MouseEvent, surahNumber: number) {
    e.stopPropagation()
    const url = `https://cdn.islamic.network/quran/audio-surah/128/${CDN_RECITER}/${surahNumber}.mp3`
    play(surahNumber, null, url)
  }

  return (
    <div className="px-4 py-4">
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl bg-bg-card border border-border-subtle text-text-muted hover:text-text-primary transition-colors"
        >
          <ChevronLeft size={18} />
        </button>
        <h1 className="text-text-primary font-semibold text-lg">Barcha suralar</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {surahs?.map((surah, i) => (
          <motion.div
            key={surah.number}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: Math.min(0.02 * i, 0.5) }}
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
              onClick={(e) => handlePlay(e, surah.number)}
              className="p-2 rounded-lg text-text-muted hover:text-accent hover:bg-accent/10 transition-colors flex-shrink-0"
            >
              <Play size={14} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); navigate(buildRoute.recite(surah.number)) }}
              className="p-2 rounded-lg text-text-muted hover:text-accent hover:bg-accent/10 transition-colors flex-shrink-0"
            >
              <Mic size={14} />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
