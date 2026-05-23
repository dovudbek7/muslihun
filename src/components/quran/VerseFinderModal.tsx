import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mic, MicOff, Search } from 'lucide-react'
import { useVerseFinder } from '@/hooks/useVerseFinder'
import { cn } from '@/components/ui/cn'

interface VerseSlim {
  id: number
  number: number
  text_arabic: string
}

interface VerseFinderModalProps {
  verses: VerseSlim[]
  onFound: (verseId: number) => void
  onClose: () => void
}

export function VerseFinderModal({ verses, onFound, onClose }: VerseFinderModalProps) {
  const { transcript, result, isListening, isSupported, start, stop, reset } = useVerseFinder(verses)

  useEffect(() => () => { stop() }, [stop])

  const foundVerse = result ? verses.find(v => v.id === result.id) : null
  const accuracy = result ? Math.round(result.score * 100) : 0

  const handleUse = () => {
    if (!result) return
    onFound(result.id)
    onClose()
  }

  return (
    <>
      <motion.div
        key="vf-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/70"
        onClick={() => { reset(); onClose() }}
      />
      <motion.div
        key="vf-modal"
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 20 }}
        transition={{ type: 'spring', stiffness: 320, damping: 30 }}
        className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 bg-bg-card border border-border rounded-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border-subtle">
          <div className="flex items-center gap-2">
            <Search size={16} className="text-accent" />
            <span className="text-text-primary font-medium text-sm">Oyat Topish</span>
          </div>
          <button
            onClick={() => { reset(); onClose() }}
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-elevated transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-5 py-6 space-y-5">
          {/* Instructions */}
          {!isListening && !transcript && (
            <p className="text-text-muted text-sm text-center">
              Istalgan oyatdan 3–5 so'z o'qing — tizim qaysi oyat ekanini aniqlaydi
            </p>
          )}

          {/* Transcript */}
          {transcript && (
            <div className="rounded-xl bg-bg-elevated px-4 py-3 min-h-[52px]">
              <p className="font-arabic text-text-arabic text-lg text-right leading-loose" dir="rtl">
                {transcript}
              </p>
            </div>
          )}

          {/* Result */}
          <AnimatePresence>
            {foundVerse && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="rounded-xl border border-accent/30 bg-accent/5 px-4 py-3 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-accent text-xs font-medium">
                    {foundVerse.number}-oyat topildi
                  </span>
                  <span className="text-text-muted text-xs">{accuracy}% mos</span>
                </div>
                <p className="font-arabic text-text-arabic text-base text-right leading-loose" dir="rtl">
                  {foundVerse.text_arabic}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mic button */}
          <div className="flex flex-col items-center gap-3">
            {!isListening ? (
              <motion.button
                whileTap={{ scale: 0.93 }}
                onClick={start}
                disabled={!isSupported}
                className={cn(
                  'w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-colors',
                  isSupported
                    ? 'bg-accent text-bg-primary shadow-accent/30'
                    : 'bg-bg-elevated text-text-muted cursor-not-allowed'
                )}
              >
                <Mic size={26} />
              </motion.button>
            ) : (
              <motion.button
                whileTap={{ scale: 0.93 }}
                onClick={stop}
                className="relative w-16 h-16 rounded-full bg-error-red/90 text-white flex items-center justify-center shadow-lg shadow-error-red/30"
              >
                <span className="absolute inset-0 rounded-full bg-error-red/30 animate-ping" />
                <MicOff size={26} className="relative z-10" />
              </motion.button>
            )}

            {!isSupported && (
              <p className="text-text-muted text-xs">Chrome yoki Edge kerak</p>
            )}
          </div>

          {/* Action */}
          {foundVerse && (
            <button
              onClick={handleUse}
              className="w-full py-3 bg-accent text-bg-primary rounded-xl font-medium text-sm"
            >
              {foundVerse.number}-oyatdan boshlash
            </button>
          )}
        </div>
      </motion.div>
    </>
  )
}
