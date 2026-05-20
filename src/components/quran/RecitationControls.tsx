import { Mic, RotateCcw, Pause, Play } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/components/ui/cn'
import type { SessionStatus, LastError } from '@/stores/recitationStore'

interface RecitationControlsProps {
  status: SessionStatus
  isListening: boolean
  isSupported: boolean
  error: string | null
  lastError: LastError | null
  correctCount: number
  errorCount: number
  totalWords: number
  onStart: () => void
  onPause: () => void
  onResume: () => void
  onReset: () => void
}

export function RecitationControls({
  status, isListening, isSupported, error, lastError,
  correctCount, errorCount, totalWords,
  onStart, onPause, onResume, onReset,
}: RecitationControlsProps) {
  const progress = totalWords > 0 ? Math.round((correctCount / totalWords) * 100) : 0

  return (
    <div className="flex flex-col items-center gap-5">
      {status !== 'idle' && (
        <div className="w-full bg-bg-elevated rounded-full h-1 overflow-hidden">
          <motion.div
            className="h-full bg-accent rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      )}

      {status !== 'idle' && (
        <div className="flex gap-6 text-sm">
          <span className="text-success font-medium">{correctCount} to'g'ri</span>
          <span className="text-error-red font-medium">{errorCount} xato</span>
          <span className="text-text-muted">{totalWords} so'z</span>
        </div>
      )}

      {isListening && (
        <div className="relative flex items-center justify-center">
          <span className="absolute w-14 h-14 rounded-full bg-accent/15 animate-ping" />
          <span className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center z-10">
            <Mic size={20} className="text-accent" />
          </span>
        </div>
      )}

      <div className="flex gap-3 items-center">
        {status === 'idle' && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onStart}
            disabled={!isSupported}
            className={cn(
              'btn-primary flex items-center gap-2 px-8 py-3 text-base',
              !isSupported && 'opacity-50 cursor-not-allowed'
            )}
          >
            <Mic size={18} />
            Boshlash
          </motion.button>
        )}

        {status === 'listening' && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onPause}
            className="btn-ghost flex items-center gap-2"
          >
            <Pause size={16} />
            To'xtatish
          </motion.button>
        )}

        {status === 'paused' && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onResume}
            className="btn-primary flex items-center gap-2"
          >
            <Play size={16} />
            Davom etish
          </motion.button>
        )}

        {status !== 'idle' && status !== 'finished' && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onReset}
            className="btn-ghost flex items-center gap-2"
          >
            <RotateCcw size={16} />
            Qayta
          </motion.button>
        )}
      </div>

      {error && (
        <p className="text-error-red text-sm text-center">{error}</p>
      )}

      <AnimatePresence>
        {lastError && (
          <motion.div
            key={lastError.recognized}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="text-center text-sm space-y-0.5"
          >
            <p className="text-error-red font-arabic text-base" dir="rtl">{lastError.recognized}</p>
            <p className="text-text-muted text-xs">o'rniga:</p>
            <p className="text-accent font-arabic text-base" dir="rtl">{lastError.expected}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {!isSupported && status === 'idle' && (
        <p className="text-text-muted text-xs text-center">
          Chrome yoki Edge brauzeri kerak
        </p>
      )}
    </div>
  )
}
