import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, CheckCircle2 } from 'lucide-react'
import { useRecitationStore } from '@/stores/recitationStore'
import { useRecitation } from '@/hooks/useRecitation'
import { useQuranStore } from '@/stores/quranStore'
import { RecitationAyah } from './RecitationAyah'
import { RecitationControls } from './RecitationControls'
import { ARABIC_FONT_SIZE_CLASSES } from '@/constants/quran'
import { cn } from '@/components/ui/cn'

interface VerseSlim {
  id: number
  number: number
  text_arabic: string
}

interface ContinuousSurahSheetProps {
  surahNumber: number
  verses: VerseSlim[]
  startVerseIndex: number
  onClose: () => void
}

export function ContinuousSurahSheet({ verses, startVerseIndex, onClose }: ContinuousSurahSheetProps) {
  const [activeIdx, setActiveIdx] = useState(startVerseIndex)
  const [surahDone, setSurahDone] = useState(false)
  const hasStartedRef = useRef(false)
  const activeRef = useRef<HTMLDivElement>(null)

  const {
    sessionStatus, words, correctCount, errorCount, lastError,
    startSession, pause, resume, reset,
  } = useRecitationStore()
  const { isListening, isSupported, error, start, stop } = useRecitation()
  const { fontSize } = useQuranStore()

  const sizeClass = ARABIC_FONT_SIZE_CLASSES[fontSize] ?? ARABIC_FONT_SIZE_CLASSES[20]
  const activeVerse = verses[activeIdx]

  const handleStart = () => {
    if (!activeVerse) return
    hasStartedRef.current = true
    startSession(activeVerse.text_arabic)
    start()
  }

  const handlePause = () => { pause(); stop() }
  const handleResume = () => { resume(); start() }
  const handleReset = () => { reset(); stop(); hasStartedRef.current = false }

  const handleClose = () => {
    reset()
    stop()
    onClose()
  }

  // Auto-advance when verse finishes
  useEffect(() => {
    if (sessionStatus !== 'finished') return
    const nextIdx = activeIdx + 1
    if (nextIdx >= verses.length) {
      setSurahDone(true)
      stop()
      return
    }
    const timer = setTimeout(() => {
      reset()
      setActiveIdx(nextIdx)
    }, 500)
    return () => clearTimeout(timer)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionStatus])

  // Auto-start next verse after advancing
  useEffect(() => {
    if (!hasStartedRef.current || !verses[activeIdx]) return
    const timer = setTimeout(() => {
      startSession(verses[activeIdx].text_arabic)
      start()
    }, 100)
    return () => clearTimeout(timer)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIdx])

  // Scroll active verse into view
  useEffect(() => {
    activeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [activeIdx])

  return (
    <>
      <motion.div
        key="cs-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 bg-black/60"
        onClick={handleClose}
      />
      <motion.div
        key="cs-sheet"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 35 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-bg-card border-t border-border rounded-t-2xl flex flex-col"
        style={{ maxHeight: '88vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border-subtle flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-text-secondary text-sm font-medium">Uzluksiz Qiroat</span>
            {!surahDone && (
              <span className="text-text-muted text-xs">
                {activeIdx + 1}/{verses.length}
              </span>
            )}
            {surahDone && (
              <span className="flex items-center gap-1 text-success text-xs font-medium">
                <CheckCircle2 size={13} />
                Tugadi
              </span>
            )}
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-elevated transition-colors"
          >
            <ChevronDown size={18} />
          </button>
        </div>

        {/* Verse list */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
          {verses.map((verse, idx) => {
            const isPast = idx < activeIdx
            const isActive = idx === activeIdx
            const isFuture = idx > activeIdx

            return (
              <div
                key={verse.id}
                ref={isActive ? activeRef : undefined}
                className={cn(
                  'rounded-xl px-4 py-3 transition-all',
                  isActive && 'bg-bg-elevated border border-border-subtle',
                )}
              >
                {isActive ? (
                  <RecitationAyah arabicText={verse.text_arabic} verseNumber={verse.number} />
                ) : (
                  <p
                    dir="rtl"
                    lang="ar"
                    className={cn(
                      'font-arabic text-right leading-loose',
                      sizeClass,
                      isPast && 'text-text-arabic opacity-50',
                      isFuture && 'text-text-arabic opacity-15',
                    )}
                  >
                    {verse.text_arabic}{' '}
                    <span className="text-text-muted opacity-60 text-base">﴿{verse.number}﴾</span>
                  </p>
                )}
              </div>
            )
          })}

          {surahDone && (
            <div className="flex flex-col items-center gap-2 py-8">
              <CheckCircle2 size={32} className="text-success" />
              <p className="text-text-primary font-medium">Sura tugadi!</p>
              <p className="text-text-muted text-sm">
                {correctCount} to'g'ri · {errorCount} xato
              </p>
            </div>
          )}
        </div>

        {/* Controls */}
        {!surahDone && (
          <div className="flex-shrink-0 border-t border-border-subtle px-6 py-4 pb-safe-bottom">
            <RecitationControls
              status={sessionStatus}
              isListening={isListening}
              isSupported={isSupported}
              error={error}
              lastError={lastError}
              correctCount={correctCount}
              errorCount={errorCount}
              totalWords={words.length}
              onStart={handleStart}
              onPause={handlePause}
              onResume={handleResume}
              onReset={handleReset}
            />
          </div>
        )}
      </motion.div>
    </>
  )
}
