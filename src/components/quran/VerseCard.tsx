import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Play, BookOpen, Bookmark, Mic } from 'lucide-react'
import { ArabicText } from './ArabicText'
import { RecitationAyah } from './RecitationAyah'
import { VerseActionSheet } from './VerseActionSheet'
import { cn } from '@/components/ui/cn'
import { useQuranStore } from '@/stores/quranStore'
import { useAudioStore } from '@/stores/audioStore'
import { useToggleBookmark, useBookmarkIds, useTafsir } from '@/api/quran'
import { useLongPress } from '@/hooks/useLongPress'
import type { Verse } from '@/types/quran'

interface VerseCardProps {
  verse: Verse
  surahNumber: number
  totalVerses?: number
  isActive?: boolean
  onVisible?: (verse: Verse) => void
  onRecite?: () => void
}

export function VerseCard({ verse, surahNumber, totalVerses = 0, isActive, onVisible, onRecite }: VerseCardProps) {
  const {
    openTafsir, arabicOnly, showTransliteration, showInlineTafsir, zenMode, language, reciterIdentifier,
    activeContinuousRecitation, continuousActiveVerseIdx,
    highlightedVerse, setHighlightedVerse,
  } = useQuranStore()
  const { play, currentVerse, currentSurah } = useAudioStore()
  const { data: bookmarkIds } = useBookmarkIds()
  const toggleBookmark = useToggleBookmark()
  const cardRef = useRef<HTMLDivElement>(null)
  const isBookmarked = bookmarkIds?.has(verse.id) ?? false
  const [showActionSheet, setShowActionSheet] = useState(false)

  const isHighlighted = highlightedVerse === verse.number
  const isPlaying = currentSurah === surahNumber && currentVerse === verse.number
  const isRecitationActive = activeContinuousRecitation != null &&
    activeContinuousRecitation.verses[continuousActiveVerseIdx]?.id === verse.id
  const translation = verse.translations?.find(t => t.language === language)?.text
    || verse.translation
    || null

  useEffect(() => {
    if (!onVisible || !cardRef.current) return
    const el = cardRef.current
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) onVisible(verse) },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [verse, onVisible])

  const longPressHandlers = useLongPress(
    () => setShowActionSheet(true),
    () => setHighlightedVerse(isHighlighted ? null : verse.number)
  )

  const handlePlayVerse = () => {
    const url = `https://cdn.islamic.network/quran/audio/128/${reciterIdentifier}/${surahNumber.toString().padStart(3, '0')}${verse.number.toString().padStart(3, '0')}.mp3`
    play(surahNumber, verse.number, url, totalVerses)
  }

  if (zenMode) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="py-6 px-4"
      >
        <ArabicText text={verse.text_arabic} />
      </motion.div>
    )
  }

  return (
    <>
      <motion.div
        ref={cardRef}
        data-verse-number={verse.number}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        {...longPressHandlers}
        className={cn(
          'relative overflow-hidden rounded-2xl px-4 pt-3 pb-4 transition-all duration-300',
          'border cursor-pointer select-none',
          isRecitationActive
            ? 'bg-accent/5 border-accent/40 shadow-accent-glow'
            : isHighlighted
              ? 'bg-accent/8 border-accent/35'
              : isActive
                ? 'bg-accent/5 border-accent/20 shadow-accent-glow'
                : 'bg-bg-card border-border-subtle',
          isPlaying && !isRecitationActive && 'border-accent/40 bg-accent/8'
        )}
      >
        {/* Top row: verse number + icon buttons */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={cn(
              'w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold',
              isPlaying ? 'bg-accent text-bg-primary' : 'bg-bg-elevated text-text-muted border border-border-subtle'
            )}>
              {verse.number}
            </div>
            {verse.is_sajda && (
              <span className="text-accent text-xs">۩</span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <IconBtn icon={<Play size={15} />} onClick={handlePlayVerse} active={isPlaying} title="Tinglash" />
            <IconBtn icon={<BookOpen size={15} />} onClick={() => openTafsir(surahNumber, verse.number)} title="Tafsir" />
            <IconBtn icon={<Bookmark size={15} />} onClick={() => toggleBookmark.mutate({ verse_id: verse.id })} active={isBookmarked} title="Saqlash" />
            <IconBtn icon={<Mic size={15} />} onClick={() => onRecite?.()} title="Qiroat" />
          </div>
        </div>

        {/* Arabic text */}
        <div className="flex justify-end">
          {isRecitationActive
            ? <RecitationAyah arabicText={verse.text_arabic} verseNumber={verse.number} />
            : <ArabicText text={verse.text_arabic} isActive={isPlaying} />
          }
        </div>

        {showTransliteration && verse.text_transliteration && (
          <p className="text-text-muted text-sm italic mt-3 text-left leading-relaxed">
            {verse.text_transliteration}
          </p>
        )}

        {!arabicOnly && translation && (
          <p className="text-text-secondary text-sm mt-3 leading-relaxed text-left border-t border-border-subtle pt-3">
            {translation}
          </p>
        )}

        {showInlineTafsir && (
          <InlineTafsirText surahNumber={surahNumber} verseNumber={verse.number} />
        )}

        {isPlaying && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent/30">
            <motion.div
              className="h-full bg-accent"
              animate={{ width: ['0%', '100%'] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        )}
      </motion.div>

      <VerseActionSheet
        verse={showActionSheet ? verse : null}
        surahNumber={surahNumber}
        onClose={() => setShowActionSheet(false)}
        onRecite={onRecite}
      />
    </>
  )
}

function InlineTafsirText({ surahNumber, verseNumber }: { surahNumber: number; verseNumber: number }) {
  const { language } = useQuranStore()
  const { data, isLoading } = useTafsir(surahNumber, verseNumber, language)

  if (isLoading) {
    return (
      <div className="mt-3 pt-3 border-t border-border-subtle">
        <div className="h-3 bg-bg-elevated rounded animate-pulse w-3/4 mb-1.5" />
        <div className="h-3 bg-bg-elevated rounded animate-pulse w-1/2" />
      </div>
    )
  }

  if (!data?.content) return null

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      className="mt-3 pt-3 border-t border-border-subtle"
    >
      <p className="text-xs text-text-muted font-medium mb-1.5 uppercase tracking-wider">Tafsir</p>
      <p className="text-text-secondary text-sm leading-relaxed text-left">{data.content}</p>
    </motion.div>
  )
}

function IconBtn({
  icon, onClick, active, title,
}: {
  icon: React.ReactNode
  onClick: () => void
  active?: boolean
  title?: string
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      title={title}
      className={cn(
        'w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200',
        active
          ? 'bg-accent text-bg-primary'
          : 'text-text-muted hover:text-text-primary hover:bg-bg-elevated'
      )}
    >
      {icon}
    </motion.button>
  )
}
