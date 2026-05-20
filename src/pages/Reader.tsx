import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Settings2, BookOpenCheck, Play } from 'lucide-react'
import { useQuranStore } from '@/stores/quranStore'
import { useUIStore } from '@/stores/uiStore'
import { useAudioStore } from '@/stores/audioStore'
import { useSurah, usePage } from '@/api/quran'
import { VerseCard } from '@/components/quran/VerseCard'
import { MushafView } from '@/components/quran/MushafView'
import { VerseCardSkeleton } from '@/components/ui/Skeleton'
import { cn } from '@/components/ui/cn'
import type { Verse } from '@/types/quran'

const CDN_RECITER = 'ar.alafasy'

export function Reader() {
  const { surahNumber, pageNumber, juzNumber } = useParams<{
    surahNumber?: string
    pageNumber?: string
    juzNumber?: string
  }>()

  const {
    currentSurah, currentVerse, currentPage, language,
    readingMode, zenMode, fontSize,
    setCurrentSurah, setCurrentVerse, setCurrentPage,
    navigateTo,
  } = useQuranStore()
  const { openDrawer } = useUIStore()
  const { play } = useAudioStore()

  const activeSurah = surahNumber ? parseInt(surahNumber) : currentSurah
  const activePage = pageNumber ? parseInt(pageNumber) : currentPage

  const { data: surah, isLoading: surahLoading } = useSurah(activeSurah, language)
  const { data: pageData, isLoading: pageLoading } = usePage(activePage, language)

  useEffect(() => {
    if (surahNumber) setCurrentSurah(parseInt(surahNumber))
    if (pageNumber) setCurrentPage(parseInt(pageNumber))
  }, [surahNumber, pageNumber])

  useEffect(() => {
    const key = `reader-scroll-${surahNumber ?? 'default'}`
    const saved = sessionStorage.getItem(key)
    if (saved) requestAnimationFrame(() => window.scrollTo(0, parseInt(saved)))
    const onScroll = () => sessionStorage.setItem(key, String(window.scrollY))
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [surahNumber])

  const isLoading = readingMode === 'scroll' ? surahLoading : pageLoading

  const verses: Verse[] = readingMode === 'scroll'
    ? (surah?.verses ?? [])
    : (pageData?.verses ?? [])

  function handlePlaySurah() {
    const url = `https://cdn.islamic.network/quran/audio-surah/128/${CDN_RECITER}/${activeSurah}.mp3`
    play(activeSurah, null, url)
  }

  if (isLoading) {
    return (
      <div className="px-3 py-4 space-y-2">
        {Array.from({ length: 6 }).map((_, i) => <VerseCardSkeleton key={i} />)}
      </div>
    )
  }

  return (
    <div className="relative">
      {!zenMode && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle sticky top-14 z-20 bg-bg-primary/95 backdrop-blur-md">
          <div>
            {readingMode === 'scroll' && surah && (
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
            {readingMode === 'mushaf' && (
              <span className="text-sm text-text-secondary">
                {activePage}-sahifa
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {readingMode === 'scroll' && surah && (
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
              className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-elevated transition-colors"
            >
              <Settings2 size={16} />
            </button>
          </div>
        </div>
      )}

      {readingMode === 'mushaf' && verses.length > 0 ? (
        <MushafView verses={verses} fontSize={fontSize} page={activePage} surah={surah} />
      ) : (
        <>
          {readingMode === 'scroll' && surah && verses.length > 0 && surah.number !== 1 && surah.number !== 9 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center py-6"
            >
              <p className="font-arabic text-text-arabic text-2xl leading-loose" dir="rtl">
                بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
              </p>
            </motion.div>
          )}

          <div className={cn('px-3 py-2 space-y-2', zenMode && 'px-4')}>
            {verses.map((verse) => (
              <VerseCard
                key={verse.id}
                verse={verse}
                surahNumber={readingMode === 'scroll' ? activeSurah : verse.id}
                totalVerses={surah?.total_verses ?? 0}
                isActive={currentVerse === verse.number && currentSurah === activeSurah}
                onVisible={(v) => {
                  if (currentSurah === activeSurah) setCurrentVerse(v.number)
                }}
              />
            ))}
          </div>
        </>
      )}

      {verses.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <p className="text-text-muted text-sm">Ma'lumot yuklanmadi</p>
          <p className="text-text-muted/50 text-xs">Backend serveriga ulanishni tekshiring</p>
        </div>
      )}
    </div>
  )
}
