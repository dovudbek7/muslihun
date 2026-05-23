import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Pause, Play, RotateCcw, X, Eye, EyeOff, Search } from 'lucide-react'
import { useRecitationStore } from '@/stores/recitationStore'
import { useRecitation } from '@/hooks/useRecitation'
import { useQuranStore } from '@/stores/quranStore'
import { VerseFinderModal } from './VerseFinderModal'
import { saveProgress, clearProgress } from '@/utils/recitationProgress'

export function ContinuousControlBar() {
  const {
    activeContinuousRecitation,
    continuousActiveVerseIdx,
    setContinuousActiveVerseIdx,
    closeContinuousRecitation,
  } = useQuranStore()

  const {
    sessionStatus, words, correctCount, errorCount,
    displayMode, startSession, pause, resume, reset, setDisplayMode,
  } = useRecitationStore()
  const { isListening, isSupported, error, start, stop } = useRecitation()
  const hasStartedRef = useRef(false)
  const [showFinder, setShowFinder] = useState(false)

  const verses = activeContinuousRecitation?.verses ?? []
  const surahNumber = activeContinuousRecitation?.surahNumber ?? 0
  const activeVerse = verses[continuousActiveVerseIdx]
  const total = verses.length

  const handleStart = () => {
    if (!activeVerse) return
    hasStartedRef.current = true
    startSession(activeVerse.text_arabic)
    start()
    scrollToVerse(activeVerse.number)
  }

  const handlePause = () => { pause(); stop() }
  const handleResume = () => { resume(); start() }

  const handleReset = () => {
    reset(); stop()
    hasStartedRef.current = false
    clearProgress(surahNumber)
  }

  const handleClose = () => {
    reset(); stop()
    hasStartedRef.current = false
    closeContinuousRecitation()
  }

  const handleToggleReveal = () => {
    if (sessionStatus !== 'idle') return
    setDisplayMode(displayMode === 'reveal' ? 'highlight' : 'reveal')
  }

  // Auto-advance when verse finishes
  useEffect(() => {
    if (sessionStatus !== 'finished') return
    const next = continuousActiveVerseIdx + 1
    if (next >= total) {
      clearProgress(surahNumber)
      const timer = setTimeout(() => { reset(); stop(); closeContinuousRecitation() }, 1500)
      return () => clearTimeout(timer)
    }
    saveProgress(surahNumber, next)
    const timer = setTimeout(() => {
      reset()
      setContinuousActiveVerseIdx(next)
    }, 500)
    return () => clearTimeout(timer)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionStatus])

  // Auto-start next verse after index changes
  useEffect(() => {
    if (!hasStartedRef.current) return
    const verse = verses[continuousActiveVerseIdx]
    if (!verse) return
    const timer = setTimeout(() => {
      startSession(verse.text_arabic)
      start()
      scrollToVerse(verse.number)
    }, 120)
    return () => clearTimeout(timer)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [continuousActiveVerseIdx])

  // Verse finder: jump to found verse
  const handleVerseFound = (verseId: number) => {
    const idx = verses.findIndex(v => v.id === verseId)
    if (idx === -1) return
    reset(); stop()
    setContinuousActiveVerseIdx(idx)
    hasStartedRef.current = true
    setTimeout(() => {
      startSession(verses[idx].text_arabic)
      start()
      scrollToVerse(verses[idx].number)
    }, 120)
  }

  if (!activeContinuousRecitation) return null

  const progress = words.length > 0 ? (correctCount / words.length) * 100 : 0
  const isIdle = sessionStatus === 'idle'

  return (
    <>
      <AnimatePresence>
        {showFinder && (
          <VerseFinderModal
            verses={verses}
            onFound={handleVerseFound}
            onClose={() => setShowFinder(false)}
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed bottom-20 left-3 right-3 z-40 rounded-2xl bg-bg-card border border-border shadow-xl shadow-black/20 overflow-hidden"
      >
        {/* Progress bar */}
        {!isIdle && (
          <div className="h-0.5 bg-bg-elevated">
            <motion.div
              className="h-full bg-accent"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        )}

        <div className="flex items-center gap-2 px-3 py-2.5">
          {/* Mic dot */}
          <div className="relative flex-shrink-0 w-7 h-7 flex items-center justify-center">
            {isListening ? (
              <>
                <span className="absolute inset-0 rounded-full bg-accent/25 animate-ping" />
                <span className="relative w-3 h-3 rounded-full bg-accent" />
              </>
            ) : (
              <span className="w-3 h-3 rounded-full bg-text-muted/30" />
            )}
          </div>

          {/* Stats / Start */}
          <div className="flex-1 min-w-0">
            {isIdle ? (
              <p className="text-text-muted text-xs truncate">
                {continuousActiveVerseIdx + 1}/{total} · Boshlash uchun ▶
              </p>
            ) : (
              <p className="text-xs tabular-nums">
                <span className="text-success font-medium">{correctCount}✓</span>
                {' '}
                <span className="text-error-red font-medium">{errorCount}✗</span>
                {' '}
                <span className="text-text-muted">{continuousActiveVerseIdx + 1}/{total}</span>
              </p>
            )}
            {error && <p className="text-error-red text-xs truncate">{error}</p>}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-0.5 flex-shrink-0">
            {/* Reveal mode toggle — only when idle */}
            {isIdle && (
              <button
                onClick={handleToggleReveal}
                title={displayMode === 'reveal' ? 'Reveal rejim (yoqiq)' : 'Reveal rejim'}
                className={`p-1.5 rounded-lg transition-colors ${
                  displayMode === 'reveal'
                    ? 'text-accent bg-accent/10'
                    : 'text-text-muted hover:text-text-primary hover:bg-bg-elevated'
                }`}
              >
                {displayMode === 'reveal' ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            )}

            {/* Verse finder */}
            <button
              onClick={() => setShowFinder(true)}
              title="Oyat topish"
              className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-elevated transition-colors"
            >
              <Search size={14} />
            </button>

            {/* Play / Pause / Resume */}
            {isIdle && (
              <button
                onClick={handleStart}
                disabled={!isSupported}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-accent text-bg-primary text-xs font-medium disabled:opacity-50"
              >
                <Play size={12} />
                Boshlash
              </button>
            )}
            {sessionStatus === 'listening' && (
              <button onClick={handlePause} className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-elevated transition-colors">
                <Pause size={15} />
              </button>
            )}
            {sessionStatus === 'paused' && (
              <button onClick={handleResume} className="p-1.5 rounded-lg text-accent hover:bg-accent/10 transition-colors">
                <Play size={15} />
              </button>
            )}
            {!isIdle && (
              <button onClick={handleReset} className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-elevated transition-colors">
                <RotateCcw size={13} />
              </button>
            )}
            <button onClick={handleClose} className="p-1.5 rounded-lg text-text-muted hover:text-error-red hover:bg-bg-elevated transition-colors">
              <X size={15} />
            </button>
          </div>
        </div>
      </motion.div>
    </>
  )
}

function scrollToVerse(verseNumber: number) {
  document.querySelector(`[data-verse-number="${verseNumber}"]`)
    ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}
