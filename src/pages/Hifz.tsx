import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, ChevronRight, Eye, EyeOff, Play, Pause } from 'lucide-react'
import {
  useHifzSessions, useStartHifzSession,
  useDueVerses, useSubmitReview,
  useErrorStats, useErrorLogs,
} from '@/api/hifz'
import { useSurahs } from '@/api/quran'
import { useQuranStore } from '@/stores/quranStore'
import { useAudioStore } from '@/stores/audioStore'
import { Spinner } from '@/components/ui/Spinner'
import { cn } from '@/components/ui/cn'
import type { HifzMode, HifzProgress } from '@/types/hifz'

type Tab = 'review' | 'surahs' | 'errors'

const CDN_RECITER = 'ar.alafasy'

export function Hifz() {
  const [activeTab, setActiveTab] = useState<Tab>('review')
  const [activeSurahSession, setActiveSurahSession] = useState<number | null>(null)
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

  async function handleStartSession(surahNumber: number) {
    try {
      await startSession.mutateAsync({ surah: surahNumber, mode: 'hint' })
      setActiveSurahSession(surahNumber)
      setActiveTab('review')
    } catch {
      setActiveSurahSession(surahNumber)
      setActiveTab('review')
    }
  }

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
              ) : dueVerses && dueVerses.length > 0 ? (
                <ReviewList verses={dueVerses} />
              ) : (
                <EmptyReview onGoToSurahs={() => setActiveTab('surahs')} />
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
                  onClick={() => handleStartSession(surah.number)}
                  disabled={startSession.isPending}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-bg-card border border-border-subtle rounded-xl hover:border-border transition-colors text-left disabled:opacity-50"
                >
                  <span className="w-8 h-8 rounded-lg bg-bg-elevated flex items-center justify-center text-xs text-text-muted flex-shrink-0">
                    {surah.number}
                  </span>
                  <div className="flex-1">
                    <p className="text-text-primary text-sm font-medium">{surah.name_transliteration}</p>
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
  const [blindMode, setBlindMode] = useState(false)
  const submitReview = useSubmitReview()
  const { play, pause, isPlaying, currentVerse: audioVerse, currentSurah: audioSurah } = useAudioStore()

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
  const isVerseAudioPlaying = isPlaying && audioSurah === verse.surah_number && audioVerse === verse.verse_number

  function handlePlayVerse() {
    if (isVerseAudioPlaying) {
      pause()
      return
    }
    const url = `https://cdn.islamic.network/quran/audio/128/${CDN_RECITER}/${String(verse.surah_number).padStart(3, '0')}${String(verse.verse_number).padStart(3, '0')}.mp3`
    play(verse.surah_number, verse.verse_number, url)
  }

  async function handleQuality(quality: number) {
    try {
      await submitReview.mutateAsync({ verse_id: verse.id, quality })
    } catch {
      // continue even if backend fails
    }
    setShowArabic(false)
    setCurrentIdx(i => i + 1)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-text-muted text-sm">{currentIdx + 1} / {verses.length}</span>
        <div className="flex items-center gap-2">
          {!blindMode && (
            <span className="text-text-muted text-xs">{verse.surah_number}:{verse.verse_number}</span>
          )}
          <button
            onClick={() => { setBlindMode(b => !b); setShowArabic(false) }}
            className={cn(
              'flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition-colors',
              blindMode
                ? 'bg-accent/20 text-accent'
                : 'text-text-muted hover:text-text-secondary bg-bg-elevated'
            )}
            title={blindMode ? "Ko'rinadigan rejim" : "Ko'r rejim"}
          >
            {blindMode ? <EyeOff size={11} /> : <Eye size={11} />}
            {blindMode ? 'Blind' : 'Hint'}
          </button>
        </div>
      </div>

      <div className="bg-bg-card border border-border-subtle rounded-2xl p-5">
        {showArabic ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p
              className="font-arabic text-text-arabic text-2xl leading-loose text-right"
              dir="rtl"
            >
              {verse.text_arabic}
            </p>
            <div className="flex justify-end mt-3">
              <button
                onClick={handlePlayVerse}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors',
                  isVerseAudioPlaying
                    ? 'bg-accent text-bg-primary'
                    : 'bg-bg-elevated text-text-muted hover:text-accent'
                )}
              >
                {isVerseAudioPlaying ? <Pause size={12} /> : <Play size={12} />}
                {isVerseAudioPlaying ? 'To\'xtatish' : 'Tinglash'}
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center py-6 gap-3">
            <EyeOff size={24} className="text-text-muted/40" />
            <p className="text-text-muted text-sm">Oyatni eslab ko'ring</p>
            {!blindMode && (
              <p className="text-text-muted/60 text-xs">{verse.surah_number}:{verse.verse_number}</p>
            )}
          </div>
        )}
      </div>

      {!showArabic ? (
        <button
          onClick={() => setShowArabic(true)}
          className="w-full flex items-center justify-center gap-2 py-3 bg-bg-elevated border border-border-subtle rounded-xl text-text-secondary text-sm hover:text-text-primary transition-colors"
        >
          <Eye size={15} />
          {blindMode ? 'Tekshirish' : "Ko'rsatish"}
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
                disabled={submitReview.isPending}
                className={cn('py-3 rounded-xl border text-sm font-medium transition-all disabled:opacity-50', color)}
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

function EmptyReview({ onGoToSurahs }: { onGoToSurahs: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <CheckCircle2 size={48} className="text-emerald-400/50" />
      <p className="text-text-primary font-medium">Bugunlik takror yo'q</p>
      <p className="text-text-muted text-sm text-center">
        Yangi sura qo'shish uchun "Suralar" tabini oching
      </p>
      <button
        onClick={onGoToSurahs}
        className="px-5 py-2.5 bg-accent/10 border border-accent/30 rounded-xl text-accent text-sm font-medium hover:bg-accent/20 transition-colors"
      >
        Suralar
      </button>
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
