import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Brain, AlertTriangle, CheckCircle2, Clock, ChevronRight, Eye, EyeOff } from 'lucide-react'
import {
  useHifzSessions, useStartHifzSession,
  useDueVerses, useSubmitReview,
  useErrorStats, useErrorLogs,
} from '@/api/hifz'
import { useSurahs } from '@/api/quran'
import { useQuranStore } from '@/stores/quranStore'
import { Spinner } from '@/components/ui/Spinner'
import { cn } from '@/components/ui/cn'
import type { HifzMode, HifzProgress } from '@/types/hifz'

type Tab = 'review' | 'surahs' | 'errors'

export function Hifz() {
  const [activeTab, setActiveTab] = useState<Tab>('review')
  const { language } = useQuranStore()
  const { data: dueVerses, isLoading: dueLoading } = useDueVerses()
  const { data: errorStats } = useErrorStats()
  const { data: redErrors } = useErrorLogs('RED')
  const { data: yellowErrors } = useErrorLogs('YELLOW')
  const { data: surahs } = useSurahs(language)
  const startSession = useStartHifzSession()

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: 'review', label: 'Takror', count: dueVerses?.length },
    { id: 'surahs', label: 'Suralar' },
    { id: 'errors', label: 'Xatolar', count: (errorStats?.total_red ?? 0) + (errorStats?.total_yellow ?? 0) },
  ]

  return (
    <div className="flex flex-col min-h-full">
      <div className="px-4 pt-4 pb-0">
        <h1 className="text-text-primary font-semibold text-xl mb-4">Hifz</h1>

        <div className="flex gap-1 bg-bg-elevated rounded-xl p-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-all',
                activeTab === tab.id
                  ? 'bg-bg-card text-text-primary shadow-sm'
                  : 'text-text-muted hover:text-text-secondary'
              )}
            >
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className="text-xs bg-accent/20 text-accent rounded-full px-1.5 py-0.5 leading-none">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 px-4 py-4">
        <AnimatePresence mode="wait">
          {activeTab === 'review' && (
            <motion.div
              key="review"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {dueLoading ? (
                <div className="flex justify-center py-12"><Spinner /></div>
              ) : dueVerses?.length === 0 ? (
                <EmptyReview />
              ) : (
                <ReviewList verses={dueVerses ?? []} />
              )}
            </motion.div>
          )}

          {activeTab === 'surahs' && (
            <motion.div
              key="surahs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-2"
            >
              {surahs?.map(surah => (
                <button
                  key={surah.number}
                  onClick={() => startSession.mutateAsync({ surah: surah.number, mode: 'hint' })}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-bg-card border border-border-subtle rounded-xl hover:border-border transition-colors text-left"
                >
                  <span className="w-8 h-8 rounded-lg bg-bg-elevated flex items-center justify-center text-xs text-text-muted flex-shrink-0">
                    {surah.number}
                  </span>
                  <div className="flex-1">
                    <p className="text-text-primary text-sm font-medium">{surah.name_en}</p>
                    <p className="text-text-muted text-xs">{surah.total_verses} oyat</p>
                  </div>
                  <p className="font-arabic text-text-arabic text-base">{surah.name_arabic}</p>
                  <ChevronRight size={14} className="text-text-muted" />
                </button>
              ))}
            </motion.div>
          )}

          {activeTab === 'errors' && (
            <motion.div
              key="errors"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {errorStats && (
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-red-400/10 border border-red-400/20 rounded-xl p-3">
                    <p className="text-red-400 font-bold text-2xl">{errorStats.total_red}</p>
                    <p className="text-text-muted text-xs mt-0.5">Qizil xato</p>
                  </div>
                  <div className="bg-yellow-400/10 border border-yellow-400/20 rounded-xl p-3">
                    <p className="text-yellow-400 font-bold text-2xl">{errorStats.total_yellow}</p>
                    <p className="text-text-muted text-xs mt-0.5">Sariq xato</p>
                  </div>
                </div>
              )}

              {redErrors?.map(err => (
                <ErrorItem key={err.id} error={err} />
              ))}
              {yellowErrors?.map(err => (
                <ErrorItem key={err.id} error={err} />
              ))}

              {!redErrors?.length && !yellowErrors?.length && (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <CheckCircle2 size={40} className="text-emerald-400/50" />
                  <p className="text-text-muted text-sm">Xato yo'q!</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function ReviewList({ verses }: { verses: HifzProgress[] }) {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [showArabic, setShowArabic] = useState(false)
  const submitReview = useSubmitReview()

  if (currentIdx >= verses.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <CheckCircle2 size={48} className="text-emerald-400" />
        <p className="text-text-primary font-medium">Barcha takrorlandi!</p>
        <p className="text-text-muted text-sm">Bugunlik ish tugadi</p>
      </div>
    )
  }

  const verse = verses[currentIdx]

  async function handleQuality(quality: number) {
    await submitReview.mutateAsync({ verse_id: verse.id, quality })
    setShowArabic(false)
    setCurrentIdx(i => i + 1)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-text-muted text-sm">{currentIdx + 1} / {verses.length}</span>
        <span className="text-text-muted text-xs">
          {verse.surah_number}:{verse.verse_number}
        </span>
      </div>

      <div className="bg-bg-card border border-border-subtle rounded-2xl p-5">
        {showArabic ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-arabic text-text-arabic text-2xl leading-loose text-right"
            dir="rtl"
          >
            {verse.text_arabic}
          </motion.p>
        ) : (
          <div className="flex flex-col items-center py-6 gap-3">
            <EyeOff size={24} className="text-text-muted/40" />
            <p className="text-text-muted text-sm">Oyatni eslab ko'ring</p>
            <p className="text-text-muted/60 text-xs">{verse.surah_number}:{verse.verse_number}</p>
          </div>
        )}
      </div>

      {!showArabic ? (
        <button
          onClick={() => setShowArabic(true)}
          className="w-full flex items-center justify-center gap-2 py-3 bg-bg-elevated border border-border-subtle rounded-xl text-text-secondary text-sm hover:text-text-primary transition-colors"
        >
          <Eye size={15} />
          Ko'rsatish
        </button>
      ) : (
        <div className="space-y-2">
          <p className="text-text-muted text-xs text-center mb-3">Qanday esladingiz?</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { quality: 5, label: 'Mukammal', color: 'bg-emerald-400/10 border-emerald-400/30 text-emerald-400' },
              { quality: 4, label: "Yaxshi esladim", color: 'bg-blue-400/10 border-blue-400/30 text-blue-400' },
              { quality: 2, label: "Qiyin bo'ldi", color: 'bg-yellow-400/10 border-yellow-400/30 text-yellow-400' },
              { quality: 0, label: 'Unutdim', color: 'bg-red-400/10 border-red-400/30 text-red-400' },
            ].map(({ quality, label, color }) => (
              <motion.button
                key={quality}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleQuality(quality)}
                className={cn('py-3 rounded-xl border text-sm font-medium transition-all', color)}
              >
                {label}
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function EmptyReview() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <CheckCircle2 size={48} className="text-emerald-400/50" />
      <p className="text-text-primary font-medium">Bugunlik takror yo'q</p>
      <p className="text-text-muted text-sm">Yangi sura qo'shish uchun "Suralar" tabini oching</p>
    </div>
  )
}

function ErrorItem({ error }: { error: { id: number; surah_number: number; verse_number: number; text_arabic: string; error_type: string; notes: string } }) {
  return (
    <div className={cn(
      'px-4 py-3 rounded-xl border',
      error.error_type === 'RED'
        ? 'bg-red-400/5 border-red-400/20'
        : 'bg-yellow-400/5 border-yellow-400/20'
    )}>
      <div className="flex items-center justify-between mb-1">
        <span className={cn('text-xs font-medium', error.error_type === 'RED' ? 'text-red-400' : 'text-yellow-400')}>
          {error.error_type === 'RED' ? 'Katta xato' : 'Kichik xato'}
        </span>
        <span className="text-text-muted text-xs">{error.surah_number}:{error.verse_number}</span>
      </div>
      <p className="font-arabic text-text-arabic text-base leading-relaxed text-right" dir="rtl">
        {error.text_arabic}
      </p>
      {error.notes && (
        <p className="text-text-muted text-xs mt-1">{error.notes}</p>
      )}
    </div>
  )
}
