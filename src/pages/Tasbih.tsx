import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RotateCcw, Check } from 'lucide-react'
import {
  useTasbihDhikr,
  useTasbihSessions,
  useCreateTasbihSession,
  useIncrementTasbih,
} from '@/api/gamification'
import { Spinner } from '@/components/ui/Spinner'
import { cn } from '@/components/ui/cn'

export function Tasbih() {
  const [activeSessionId, setActiveSessionId] = useState<number | null>(null)
  const [localCount, setLocalCount] = useState(0)

  const { data: dhikrList, isLoading: dhikrLoading } = useTasbihDhikr()
  const { data: sessions } = useTasbihSessions()
  const createSession = useCreateTasbihSession()
  const increment = useIncrementTasbih()

  const activeSession = sessions?.find(s => s.id === activeSessionId)

  async function handleSelectDhikr(dhikrId: number) {
    const session = await createSession.mutateAsync({ dhikr_id: dhikrId, target: 33 })
    setActiveSessionId(session.id)
    setLocalCount(0)
  }

  async function handleTap() {
    if (!activeSession) return
    setLocalCount(c => c + 1)
    await increment.mutateAsync({ sessionId: activeSession.id, amount: 1 })
  }

  function handleReset() {
    setActiveSessionId(null)
    setLocalCount(0)
  }

  const displayCount = activeSession
    ? Math.max(localCount, activeSession.count)
    : localCount

  const target = activeSession?.target ?? 33
  const progress = Math.min(displayCount / target, 1)
  const completed = displayCount >= target

  if (dhikrLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="px-4 py-6">
      <h1 className="text-text-primary font-semibold text-xl mb-6">Tasbih</h1>

      {!activeSessionId ? (
        <div className="space-y-3">
          <p className="text-text-muted text-sm mb-4">Zikr tanlang:</p>
          {dhikrList?.map((dhikr) => (
            <motion.button
              key={dhikr.id}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleSelectDhikr(dhikr.id)}
              className="w-full flex items-center justify-between px-4 py-4 bg-bg-card border border-border-subtle rounded-xl hover:border-accent/30 transition-all"
            >
              <div className="text-left">
                <p className="text-text-primary font-medium text-sm">{dhikr.text_uz}</p>
                <p className="text-text-muted text-xs mt-0.5 font-arabic">{dhikr.text_transliteration}</p>
              </div>
              <p className="font-arabic text-text-arabic text-lg">{dhikr.text_arabic}</p>
            </motion.button>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-8">
          {activeSession && (
            <div className="text-center">
              <p className="font-arabic text-text-arabic text-2xl leading-relaxed" dir="rtl">
                {activeSession.dhikr.text_arabic}
              </p>
              <p className="text-text-secondary text-sm mt-2">
                {activeSession.dhikr.text_uz}
              </p>
            </div>
          )}

          <div className="relative w-52 h-52">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50" cy="50" r="44"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                className="text-bg-elevated"
              />
              <motion.circle
                cx="50" cy="50" r="44"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                className={completed ? 'text-emerald-400' : 'text-accent'}
                strokeDasharray={`${2 * Math.PI * 44}`}
                animate={{
                  strokeDashoffset: (1 - progress) * 2 * Math.PI * 44,
                }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              />
            </svg>
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={handleTap}
              className={cn(
                'absolute inset-4 rounded-full flex flex-col items-center justify-center',
                'transition-colors select-none',
                completed
                  ? 'bg-emerald-400/20 border-2 border-emerald-400/40'
                  : 'bg-accent/10 border-2 border-accent/20 hover:bg-accent/15 active:bg-accent/25'
              )}
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={displayCount}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 1.1, opacity: 0 }}
                  className={cn(
                    'text-4xl font-bold',
                    completed ? 'text-emerald-400' : 'text-accent'
                  )}
                >
                  {completed ? <Check size={40} /> : displayCount}
                </motion.span>
              </AnimatePresence>
              <span className="text-text-muted text-xs mt-1">/ {target}</span>
            </motion.button>
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleReset}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-bg-elevated border border-border-subtle text-text-secondary text-sm hover:text-text-primary transition-colors"
          >
            <RotateCcw size={14} />
            Yangi zikr
          </motion.button>
        </div>
      )}
    </div>
  )
}
