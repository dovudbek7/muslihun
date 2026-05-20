import { AnimatePresence, motion } from 'framer-motion'
import { Play, BookOpen, Bookmark, X, Mic } from 'lucide-react'
import { useQuranStore } from '@/stores/quranStore'
import { useAudioStore } from '@/stores/audioStore'
import { useToggleBookmark, useBookmarkIds } from '@/api/quran'
import { cn } from '@/components/ui/cn'
import type { Verse, Surah } from '@/types/quran'

interface VerseActionSheetProps {
  verse: Verse | null
  surah: Surah | null
  onClose: () => void
  onRecite?: () => void
}

export function VerseActionSheet({ verse, surah, onClose, onRecite }: VerseActionSheetProps) {
  const { openTafsir, reciterIdentifier } = useQuranStore()
  const { play, currentVerse, currentSurah } = useAudioStore()
  const { data: bookmarkIds } = useBookmarkIds()
  const toggleBookmark = useToggleBookmark()

  const surahNumber = surah?.number ?? verse?.surah_number ?? 1
  const totalVerses = surah?.total_verses ?? 0
  const isBookmarked = verse ? (bookmarkIds?.has(verse.id) ?? false) : false
  const isPlaying = verse ? currentSurah === surahNumber && currentVerse === verse.number : false

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
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 35 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-bg-card border-t border-border rounded-t-2xl pb-safe-bottom"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-border-subtle">
              <span className="text-text-muted text-sm font-arabic" dir="rtl">
                {surah?.name_arabic} ﴿{verse.number}﴾
              </span>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-elevated transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="px-5 pt-4 pb-5">
              <p
                className="font-arabic text-text-arabic text-xl leading-loose text-right mb-5"
                dir="rtl"
                lang="ar"
              >
                {verse.text_arabic}
              </p>

              <div className="grid grid-cols-4 gap-2.5">
                <ActionBtn
                  icon={<Play size={18} />}
                  label="Tinglash"
                  onClick={handlePlay}
                  active={isPlaying}
                />
                <ActionBtn
                  icon={<BookOpen size={18} />}
                  label="Tafsir"
                  onClick={handleTafsir}
                />
                <ActionBtn
                  icon={<Bookmark size={18} />}
                  label={isBookmarked ? 'Saqlangan' : 'Saqlash'}
                  onClick={handleBookmark}
                  active={isBookmarked}
                />
                <ActionBtn
                  icon={<Mic size={18} />}
                  label="Qiroat"
                  onClick={handleRecite}
                />
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
