import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, BookOpen, Volume2 } from 'lucide-react'
import { ArabicText } from './ArabicText'
import { cn } from '@/components/ui/cn'
import { useQuranStore } from '@/stores/quranStore'
import { useAudioStore } from '@/stores/audioStore'
import type { Verse } from '@/types/quran'

interface VerseCardProps {
  verse: Verse
  surahNumber: number
  totalVerses?: number
  isActive?: boolean
  onVisible?: (verse: Verse) => void
}

export function VerseCard({ verse, surahNumber, totalVerses = 0, isActive, onVisible }: VerseCardProps) {
  const [showActions, setShowActions] = useState(false)
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>()
  const { openTafsir, arabicOnly, showTransliteration, zenMode, language } = useQuranStore()
  const { play, currentVerse, currentSurah } = useAudioStore()
  const cardRef = useRef<HTMLDivElement>(null)

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

  const isPlaying = currentSurah === surahNumber && currentVerse === verse.number
  const translation = verse.translations?.find(t => t.language === language)?.text
    || verse.translation
    || null

  const handleRipple = (e: React.MouseEvent) => {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const id = Date.now()
    setRipples(prev => [...(prev || []), { x, y, id }])
    setTimeout(() => setRipples(prev => prev?.filter(r => r.id !== id)), 600)
  }

  const handlePlayVerse = () => {
    const url = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${surahNumber.toString().padStart(3, '0')}${verse.number.toString().padStart(3, '0')}.mp3`
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
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={cn(
        'group relative overflow-hidden rounded-2xl px-5 py-5 transition-all duration-300 cursor-pointer',
        'border',
        isActive
          ? 'bg-accent/5 border-accent/20 shadow-accent-glow'
          : 'bg-bg-card border-border-subtle hover:border-border hover:bg-bg-elevated',
        isPlaying && 'border-accent/40 bg-accent/8'
      )}
      onClick={(e) => { handleRipple(e); setShowActions(s => !s) }}
    >
      {ripples?.map(r => (
        <span
          key={r.id}
          className="absolute rounded-full bg-accent/20 pointer-events-none"
          style={{
            left: r.x - 10,
            top: r.y - 10,
            width: 20,
            height: 20,
            animation: 'ripple 0.6s ease-out forwards',
          }}
        />
      ))}

      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 flex flex-col items-center gap-1.5">
          <div className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold',
            isPlaying ? 'bg-accent text-bg-primary' : 'bg-bg-elevated text-text-muted border border-border-subtle'
          )}>
            {verse.number}
          </div>
          {verse.is_sajda && (
            <span className="text-accent text-xs">۩</span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-end mb-3">
            <ArabicText text={verse.text_arabic} isActive={isActive || isPlaying} />
          </div>

          {showTransliteration && verse.text_transliteration && (
            <p className="text-text-muted text-sm italic mt-2 text-left leading-relaxed">
              {verse.text_transliteration}
            </p>
          )}

          {!arabicOnly && translation && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="text-text-secondary text-sm mt-3 leading-relaxed text-left border-t border-border-subtle pt-3"
            >
              {translation}
            </motion.p>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showActions && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="flex gap-2 mt-4 pt-3 border-t border-border-subtle"
            onClick={e => e.stopPropagation()}
          >
            <ActionBtn
              icon={<Play size={14} />}
              label="Tinglash"
              onClick={handlePlayVerse}
              active={isPlaying}
            />
            <ActionBtn
              icon={<BookOpen size={14} />}
              label="Tafsir"
              onClick={() => { openTafsir(surahNumber, verse.number); setShowActions(false) }}
            />
          </motion.div>
        )}
      </AnimatePresence>

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
  )
}

function ActionBtn({
  icon,
  label,
  onClick,
  active,
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
        'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium',
        'transition-all duration-200',
        active
          ? 'bg-accent text-bg-primary'
          : 'bg-bg-hover text-text-secondary hover:text-text-primary hover:bg-bg-elevated'
      )}
    >
      {icon}
      {label}
    </motion.button>
  )
}
