import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useRecitationStore } from '@/stores/recitationStore'
import { useRecitation } from '@/hooks/useRecitation'
import { RecitationAyah } from './RecitationAyah'
import { RecitationControls } from './RecitationControls'
import type { Verse } from '@/types/quran'

interface RecitationSheetProps {
  verse: Verse | null
  onClose: () => void
}

export function RecitationSheet({ verse, onClose }: RecitationSheetProps) {
  const {
    sessionStatus, words, correctCount, errorCount, lastError,
    startSession, pause, resume, reset,
  } = useRecitationStore()
  const { isListening, isSupported, error, start, stop } = useRecitation()

  const totalWords = words.length

  const handleStart = () => {
    if (!verse) return
    startSession(verse.text_arabic)
    start()
  }

  const handlePause = () => { pause(); stop() }
  const handleResume = () => { resume(); start() }
  const handleReset = () => { reset(); stop() }

  const handleClose = () => {
    reset()
    stop()
    onClose()
  }

  useEffect(() => {
    reset()
    stop()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verse?.id])

  return (
    <AnimatePresence>
      {verse && (
        <>
          <motion.div
            key="rec-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60"
            onClick={handleClose}
          />
          <motion.div
            key="rec-sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 35 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-bg-card border-t border-border rounded-t-2xl pb-safe-bottom"
            style={{ maxHeight: '78vh' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-border-subtle flex-shrink-0">
              <span className="text-text-secondary text-sm font-medium">Qiroat mashqi</span>
              <button
                onClick={handleClose}
                className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-elevated transition-colors"
              >
                <ChevronDown size={18} />
              </button>
            </div>

            <div className="flex flex-col gap-6 px-6 py-5 overflow-y-auto" style={{ maxHeight: 'calc(78vh - 64px)' }}>
              <RecitationAyah arabicText={verse.text_arabic} verseNumber={verse.number} />

              <RecitationControls
                status={sessionStatus}
                isListening={isListening}
                isSupported={isSupported}
                error={error}
                lastError={lastError}
                correctCount={correctCount}
                errorCount={errorCount}
                totalWords={totalWords}
                onStart={handleStart}
                onPause={handlePause}
                onResume={handleResume}
                onReset={handleReset}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
