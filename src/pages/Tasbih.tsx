import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RotateCcw, Check, Hash } from 'lucide-react'
import {
  useTasbihDhikr,
  useTasbihSessions,
  useCreateTasbihSession,
  useIncrementTasbih,
} from '@/api/gamification'
import { Spinner } from '@/components/ui/Spinner'
import { cn } from '@/components/ui/cn'
import type { TasbihDhikr } from '@/types/gamification'

const FALLBACK_DHIKR: TasbihDhikr[] = [
  { id: 1, text_arabic: 'سُبْحَانَ اللهِ', text_transliteration: 'Subhanallah', text_en: 'Glory be to Allah', text_ru: 'Слава Аллаху', text_uz: 'Allohga hamdu sanolar', default_target: 33 },
  { id: 2, text_arabic: 'اَلْحَمْدُ لِلهِ', text_transliteration: 'Alhamdulillah', text_en: 'Praise be to Allah', text_ru: 'Хвала Аллаху', text_uz: 'Barcha maqtovlar Allohga', default_target: 33 },
  { id: 3, text_arabic: 'اَللهُ أَكْبَرُ', text_transliteration: 'Allahu Akbar', text_en: 'Allah is the Greatest', text_ru: 'Аллах велик', text_uz: 'Alloh ulugdir', default_target: 34 },
  { id: 4, text_arabic: 'لَا إِلَهَ إِلَّا اللهُ', text_transliteration: 'La ilaha illallah', text_en: 'There is no god but Allah', text_ru: 'Нет бога, кроме Аллаха', text_uz: "Allohdan o'zga iloh yo'q", default_target: 100 },
  { id: 5, text_arabic: 'أَسْتَغْفِرُ اللهَ', text_transliteration: 'Astaghfirullah', text_en: 'I seek forgiveness from Allah', text_ru: 'Прошу прощения у Аллаха', text_uz: 'Allohdan kechirim so\'rayman', default_target: 100 },
]

interface LocalSession {
  dhikr: TasbihDhikr
  count: number
  target: number
}

export function Tasbih() {
  const [localSession, setLocalSession] = useState<LocalSession | null>(null)
  const [backendSessionId, setBackendSessionId] = useState<number | null>(null)
  const [simpleCount, setSimpleCount] = useState<number | null>(null)

  const { data: dhikrList, isLoading: dhikrLoading } = useTasbihDhikr()
  const { data: sessions } = useTasbihSessions()
  const createSession = useCreateTasbihSession()
  const increment = useIncrementTasbih()

  const displayDhikr = dhikrList && dhikrList.length > 0 ? dhikrList : FALLBACK_DHIKR

  const backendSession = sessions?.find(s => s.id === backendSessionId)

  const displayCount = backendSession ? Math.max(localSession?.count ?? 0, backendSession.count) : (localSession?.count ?? 0)
  const target = localSession?.target ?? 33
  const progress = Math.min(displayCount / target, 1)
  const completed = displayCount >= target

  async function handleSelectDhikr(dhikr: TasbihDhikr) {
    const session: LocalSession = { dhikr, count: 0, target: dhikr.default_target }
    setLocalSession(session)
    try {
      const created = await createSession.mutateAsync({ dhikr_id: dhikr.id, target: dhikr.default_target })
      setBackendSessionId(created.id)
    } catch {
      // offline fallback — use local counting only
    }
  }

  async function handleTap() {
    if (!localSession) return
    const newCount = localSession.count + 1
    setLocalSession(s => s ? { ...s, count: newCount } : s)
    if (backendSessionId) {
      try {
        await increment.mutateAsync({ sessionId: backendSessionId, amount: 1 })
      } catch {
        // ignore — count is tracked locally
      }
    }
  }

  function handleReset() {
    setLocalSession(null)
    setBackendSessionId(null)
  }

  if (dhikrLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <Spinner />
      </div>
    )
  }

  if (simpleCount !== null) {
    return (
      <div className="px-4 py-6 flex flex-col items-center gap-8">
        <h1 className="text-text-primary font-semibold text-xl self-start">Oddiy tasbih</h1>
        <div className="relative w-52 h-52">
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setSimpleCount(c => (c ?? 0) + 1)}
            className="absolute inset-0 rounded-full bg-accent/10 border-2 border-accent/20 hover:bg-accent/15 active:bg-accent/25 flex flex-col items-center justify-center select-none"
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={simpleCount}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.1, opacity: 0 }}
                className="text-5xl font-bold text-accent"
              >
                {simpleCount}
              </motion.span>
            </AnimatePresence>
            <span className="text-text-muted text-xs mt-1">bosing</span>
          </motion.button>
        </div>
        <div className="flex gap-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setSimpleCount(0)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-bg-elevated border border-border-subtle text-text-secondary text-sm hover:text-text-primary transition-colors"
          >
            <RotateCcw size={14} />
            Nolga
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setSimpleCount(null)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-bg-elevated border border-border-subtle text-text-secondary text-sm hover:text-text-primary transition-colors"
          >
            Orqaga
          </motion.button>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-6">
      <h1 className="text-text-primary font-semibold text-xl mb-6">Tasbih</h1>

      {!localSession ? (
        <div className="space-y-3">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setSimpleCount(0)}
            className="w-full flex items-center gap-3 px-4 py-4 bg-accent/10 border border-accent/30 rounded-xl hover:bg-accent/15 transition-all mb-2"
          >
            <Hash size={18} className="text-accent flex-shrink-0" />
            <div className="text-left">
              <p className="text-accent font-medium text-sm">Oddiy tasbih</p>
              <p className="text-text-muted text-xs mt-0.5">Zikrsiz shunchaki sanoq</p>
            </div>
          </motion.button>
          <p className="text-text-muted text-sm mb-2">Yoki zikr tanlang:</p>
          {displayDhikr.map((dhikr) => (
            <motion.button
              key={dhikr.id}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleSelectDhikr(dhikr)}
              className="w-full flex items-center justify-between px-4 py-4 bg-bg-card border border-border-subtle rounded-xl hover:border-accent/30 transition-all"
            >
              <div className="text-left">
                <p className="text-text-primary font-medium text-sm">{dhikr.text_uz}</p>
                <p className="text-text-muted text-xs mt-0.5 font-arabic">{dhikr.text_transliteration}</p>
              </div>
              <p className="font-arabic text-text-arabic text-xl">{dhikr.text_arabic}</p>
            </motion.button>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-8">
          <div className="text-center">
            <p className="font-arabic text-text-arabic text-3xl leading-relaxed" dir="rtl">
              {localSession.dhikr.text_arabic}
            </p>
            <p className="text-text-secondary text-sm mt-2">
              {localSession.dhikr.text_uz}
            </p>
            <p className="text-text-muted text-xs mt-1">
              {localSession.dhikr.text_transliteration}
            </p>
          </div>

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
