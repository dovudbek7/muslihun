import { useEffect } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Settings2, BookOpenCheck, Play } from 'lucide-react'
import { useQuranStore } from '@/stores/quranStore'
import { useUIStore } from '@/stores/uiStore'
import { useAudioStore } from '@/stores/audioStore'
import { useSurah, useSurahs } from '@/api/quran'
import type { Verse } from '@/types/quran'
import { loadProgress } from '@/utils/recitationProgress'
import { VerseCard } from '@/components/quran/VerseCard'
import { VerticalScroll } from '@/components/mushaf/VerticalScroll'
import { VerseCardSkeleton } from '@/components/ui/Skeleton'
import { cn } from '@/components/ui/cn'

const CDN_RECITER = 'ar.alafasy'

function Bismillah() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center py-8 px-6 gap-3"
    >
      <div className="flex items-center gap-3 w-full max-w-xs">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-accent/40" />
        <span className="text-accent/50 text-xs">✦</span>
        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-accent/40" />
      </div>
      <p
        dir="rtl"
        lang="ar"
        className="font-arabic text-text-arabic text-3xl leading-loose text-center tracking-wide"
        style={{ fontFeatureSettings: '"liga" 1, "calt" 1' }}
      >
        بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
      </p>
      <div className="flex items-center gap-3 w-full max-w-xs">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-accent/40" />
        <span className="text-accent/50 text-xs">✦</span>
        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-accent/40" />
      </div>
    </motion.div>
  )
}

export function Reader() {
  useLocation()

  const { surahNumber } = useParams<{ surahNumber?: string }>()

  const {
    currentSurah, currentVerse, language,
    readingMode, zenMode, fontSize,
    setCurrentSurah, setCurrentVerse,
    openRecitation, openContinuousRecitation,
  } = useQuranStore()
  const { openDrawer } = useUIStore()
  const { play } = useAudioStore()

  const activeSurah = surahNumber ? parseInt(surahNumber) : currentSurah

  const { data: surah, isLoading } = useSurah(activeSurah, language)
  const { data: allSurahs } = useSurahs(language)

  const surahData = allSurahs?.find(s => s.number === activeSurah) ?? surah

  useEffect(() => {
    if (surahNumber) setCurrentSurah(parseInt(surahNumber))
  }, [surahNumber])

  useEffect(() => {
    const key = `reader-scroll-${surahNumber ?? 'default'}`
    const saved = sessionStorage.getItem(key)
    if (saved) requestAnimationFrame(() => window.scrollTo(0, parseInt(saved)))
    const onScroll = () => sessionStorage.setItem(key, String(window.scrollY))
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [surahNumber])

  useEffect(() => {
    const handler = () => {
      const surahVerses = surah?.verses
      if (!surahVerses?.length) return
      const saved = loadProgress(activeSurah)
      let startIdx = 0
      if (saved !== null && saved < surahVerses.length) {
        startIdx = saved
      } else if (readingMode === 'scroll') {
        startIdx = Math.max(0, surahVerses.findIndex(v => v.number === currentVerse))
      }
      openContinuousRecitation(
        activeSurah,
        surahVerses.map(v => ({ id: v.id, number: v.number, text_arabic: v.text_arabic })),
        startIdx,
      )
    }
    window.addEventListener('open-recitation-fab', handler)
    return () => window.removeEventListener('open-recitation-fab', handler)
  }, [surah, currentVerse, readingMode, activeSurah, openContinuousRecitation])

  function handlePlaySurah() {
    const url = `https://cdn.islamic.network/quran/audio-surah/128/${CDN_RECITER}/${activeSurah}.mp3`
    play(activeSurah, null, url)
  }

  const verses: Verse[] = surah?.verses ?? []

  if (isLoading) {
    return (
      <div className="px-3 py-4 space-y-2">
        {Array.from({ length: 6 }).map((_, i) => <VerseCardSkeleton key={i} />)}
      </div>
    )
  }

  if (readingMode === 'mushaf') {
    return (
      <VerticalScroll
        verses={verses}
        surah={surahData ?? surah ?? null}
        fontSize={fontSize}
      />
    )
  }

  return (
    <div className="relative">
      {!zenMode && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle sticky top-14 z-20 bg-bg-primary/95 backdrop-blur-md">
          <div>
            {surah && (
              <div className="flex items-center gap-2">
                <BookOpenCheck size={14} className="text-accent" />
                <span className="text-sm font-medium text-text-primary">
                  {surah.name_transliteration}
                </span>
                <span className="font-arabic text-text-arabic text-base ml-1">
                  {surah.name_arabic}
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-0.5">
            {surah && (
              <button
                onClick={handlePlaySurah}
                className="p-2 rounded-lg text-text-muted hover:text-accent hover:bg-accent/10 transition-colors"
                title="Surani tinglash"
              >
                <Play size={16} />
              </button>
            )}
            <button
              onClick={() => openDrawer('settings')}
              className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-elevated transition-colors"
            >
              <Settings2 size={15} />
            </button>
          </div>
        </div>
      )}

      {surah && verses.length > 0 && surah.number !== 1 && surah.number !== 9 && (
        <Bismillah />
      )}

      <div className={cn('px-3 py-2 space-y-2', zenMode && 'px-4')}>
        {verses.map((verse) => (
          <VerseCard
            key={verse.id}
            verse={verse}
            surahNumber={activeSurah}
            totalVerses={surah?.total_verses ?? 0}
            isActive={currentVerse === verse.number && currentSurah === activeSurah}
            onVisible={(v) => {
              if (currentSurah === activeSurah) setCurrentVerse(v.number)
            }}
            onRecite={() => openRecitation(activeSurah, verse.number, verse.text_arabic)}
          />
        ))}
      </div>

      {verses.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <p className="text-text-muted text-sm">Ma'lumot yuklanmadi</p>
          <p className="text-text-muted/50 text-xs">Backend serveriga ulanishni tekshiring</p>
        </div>
      )}
    </div>
  )
}
