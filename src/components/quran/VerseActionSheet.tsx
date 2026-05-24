import { AnimatePresence, motion } from 'framer-motion'
import { Play, BookOpen, Bookmark, X, Mic, Loader2 } from 'lucide-react'
import { useQuranStore } from '@/stores/quranStore'
import { useAudioStore } from '@/stores/audioStore'
import { useToggleBookmark, useBookmarkIds, useSurahs, useTafsir } from '@/api/quran'
import { cn } from '@/components/ui/cn'
import type { Verse } from '@/types/quran'

const isDesktop = typeof window !== 'undefined' && !window.matchMedia('(pointer: coarse)').matches

interface VerseActionSheetProps {
  verse: Verse | null
  surahNumber: number
  onClose: () => void
  onRecite?: () => void
}

export function VerseActionSheet({ verse, surahNumber, onClose, onRecite }: VerseActionSheetProps) {
  const { language, openTafsir, reciterIdentifier } = useQuranStore()
  const { play, currentVerse, currentSurah } = useAudioStore()
  const { data: bookmarkIds } = useBookmarkIds()
  const { data: allSurahs } = useSurahs(language)
  const toggleBookmark = useToggleBookmark()

  const surah = allSurahs?.find(s => s.number === surahNumber) ?? null
  const totalVerses = surah?.total_verses ?? 0
  const isBookmarked = verse ? (bookmarkIds?.has(verse.id) ?? false) : false
  const isPlaying = verse ? currentSurah === surahNumber && currentVerse === verse.number : false

  const { data: tafsir, isLoading: tafsirLoading } = useTafsir(
    surahNumber,
    verse?.number ?? 0,
    language
  )

  const handlePlay = () => {
    if (!verse) return
    const url = `https://cdn.islamic.network/quran/audio/128/${reciterIdentifier}/${surahNumber.toString().padStart(3, '0')}${verse.number.toString().padStart(3, '0')}.mp3`
    play(surahNumber, verse.number, url, totalVerses)
  }

  const handleTafsir = () => {
    if (!verse) return
    openTafsir(surahNumber, verse.number)
    onClose()
  }

  const handleBookmark = () => {
    if (!verse) return
    toggleBookmark.mutate({ verse_id: verse.id })
  }

  const handleRecite = () => {
    onRecite?.()
    onClose()
  }

  const sheetClass = isDesktop
    ? 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-bg-card border border-border rounded-2xl w-full max-w-md shadow-2xl'
    : 'fixed bottom-0 left-0 right-0 z-50 bg-bg-card border-t border-border rounded-t-2xl pb-safe-bottom'

  const initial = isDesktop ? { opacity: 0, scale: 0.95 } : { y: '100%' }
  const animate = isDesktop ? { opacity: 1, scale: 1 } : { y: 0 }
  const exit = isDesktop ? { opacity: 0, scale: 0.95 } : { y: '100%' }

  return (
    <AnimatePresence>
      {verse && (
        <>
          <motion.div
            key="vas-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50"
            onClick={onClose}
          />
          <motion.div
            key="vas-sheet"
            initial={initial}
            animate={animate}
            exit={exit}
            transition={{ type: 'spring', stiffness: 300, damping: 35 }}
            className={sheetClass}
            style={{ maxHeight: isDesktop ? '85vh' : '80vh' }}
          >
            <div className="flex flex-col overflow-hidden" style={{ maxHeight: isDesktop ? '85vh' : '80vh' }}>
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-border-subtle flex-shrink-0">
                <span className="text-text-muted text-sm font-arabic" dir="rtl">
                  {surah?.name_arabic ?? ''} ﴿{verse.number}﴾
                </span>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-elevated transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Scrollable body */}
              <div className="overflow-y-auto flex-1">
                <div className="px-5 pt-4 pb-5">
                  {/* Arabic text */}
                  <p
                    className="font-arabic text-text-arabic text-xl leading-loose text-right mb-5"
                    dir="rtl"
                    lang="ar"
                  >
                    {verse.text_arabic}
                  </p>

                  {/* Action buttons */}
                  <div className="grid grid-cols-4 gap-2.5 mb-5">
                    <ActionBtn icon={<Play size={18} />} label="Tinglash" onClick={handlePlay} active={isPlaying} />
                    <ActionBtn icon={<BookOpen size={18} />} label="Tafsir" onClick={handleTafsir} />
                    <ActionBtn
                      icon={<Bookmark size={18} />}
                      label={isBookmarked ? 'Saqlangan' : 'Saqlash'}
                      onClick={handleBookmark}
                      active={isBookmarked}
                    />
                    <ActionBtn icon={<Mic size={18} />} label="Qiroat" onClick={handleRecite} />
                  </div>

                  {/* Inline tafsir */}
                  <div className="border-t border-border-subtle pt-4">
                    <p className="text-text-muted text-xs font-medium uppercase tracking-wider mb-3">Tafsir</p>
                    {tafsirLoading && (
                      <div className="flex items-center justify-center py-6">
                        <Loader2 size={18} className="text-text-muted animate-spin" />
                      </div>
                    )}
                    {!tafsirLoading && tafsir?.content && (
                      <p className="text-text-secondary text-sm leading-relaxed">{tafsir.content}</p>
                    )}
                    {!tafsirLoading && !tafsir?.content && (
                      <p className="text-text-muted text-sm text-center py-4">
                        {language === 'uz_latin' || language === 'uz_cyrillic'
                          ? "O'zbek tafsiri mavjud emas"
                          : 'Tafsir not available'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function ActionBtn({
  icon, label, onClick, active,
}: {
  icon: React.ReactNode
  label: string
  onClick: () => void
  active?: boolean
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.93 }}
      onClick={onClick}
      className={cn(
        'flex flex-col items-center gap-2 py-3.5 rounded-xl text-xs font-medium transition-colors',
        active
          ? 'bg-accent text-bg-primary'
          : 'bg-bg-elevated text-text-secondary hover:text-text-primary hover:bg-bg-hover'
      )}
    >
      {icon}
      {label}
    </motion.button>
  )
}
