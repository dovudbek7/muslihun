import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle2, ChevronRight, Eye, EyeOff, Play, Pause,
  Mic, MicOff, BarChart3, ArrowLeft, ChevronLeft,
} from 'lucide-react'
import {
  useHifzSessions, useStartHifzSession,
  useDueVerses, useSubmitReview,
  useErrorStats, useErrorLogs,
  useHifzDashboard, useTranscribeVerse,
} from '@/api/hifz'
import { useSurahs, useSurah } from '@/api/quran'
import { useQuranStore } from '@/stores/quranStore'
import { useAudioStore } from '@/stores/audioStore'
import { useAudioRecorder } from '@/hooks/useAudioRecorder'
import { Spinner } from '@/components/ui/Spinner'
import { cn } from '@/components/ui/cn'
import type { HifzMode, HifzProgress, HifzDashboard, TranscribeResult } from '@/types/hifz'
import type { Verse } from '@/types/quran'

type Tab = 'review' | 'surahs' | 'errors' | 'stats'

interface SurahReadingState {
  surahNumber: number
  surahName: string
}

export function Hifz() {
  const [activeTab, setActiveTab] = useState<Tab>('review')
  const [surahReading, setSurahReading] = useState<SurahReadingState | null>(null)
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
    { id: 'stats', label: 'Statistika' },
  ]

  async function handleStartSurah(surahNumber: number, surahName: string) {
    try {
      await startSession.mutateAsync({ surah: surahNumber, mode: 'hint' })
    } catch {
      // session may already exist
    }
    setSurahReading({ surahNumber, surahName })
  }

  // Full-screen surah reading mode
  if (surahReading) {
    return (
      <SurahReadingView
        surahNumber={surahReading.surahNumber}
        surahName={surahReading.surahName}
        onBack={() => setSurahReading(null)}
      />
    )
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
                'flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all',
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

      <div className="flex-1 px-4 py-4 overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'review' && (
            <motion.div key="review" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
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
            <motion.div key="surahs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {!surahs ? (
                <div className="flex justify-center py-12"><Spinner /></div>
              ) : (
                <div className="space-y-1.5">
                  <p className="text-text-muted text-xs mb-3">
                    {surahs.length} ta sura · Bosib o'qishni boshlang
                  </p>
                  {surahs.map(surah => (
                    <button
                      key={surah.number}
                      onClick={() => handleStartSurah(surah.number, surah.name_transliteration)}
                      disabled={startSession.isPending}
                      className="w-full flex items-center gap-3 px-4 py-3 bg-bg-card border border-border-subtle rounded-xl hover:border-accent/30 hover:bg-bg-elevated transition-colors text-left disabled:opacity-50"
                    >
                      <span className="w-8 h-8 rounded-lg bg-bg-elevated flex items-center justify-center text-xs text-text-muted flex-shrink-0 font-mono">
                        {surah.number}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-text-primary text-sm font-medium">{surah.name_transliteration}</p>
                        <p className="text-text-muted text-xs">{surah.total_verses} oyat</p>
                      </div>
                      <p className="font-arabic text-text-arabic text-base flex-shrink-0">{surah.name_arabic}</p>
                      <ChevronRight size={14} className="text-text-muted flex-shrink-0" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'errors' && (
            <motion.div key="errors" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
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
              {redErrors?.map(err => <ErrorItem key={err.id} error={err} />)}
              {yellowErrors?.map(err => <ErrorItem key={err.id} error={err} />)}
              {!redErrors?.length && !yellowErrors?.length && (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <CheckCircle2 size={40} className="text-emerald-400/50" />
                  <p className="text-text-muted text-sm">Xato yo'q!</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'stats' && (
            <motion.div key="stats" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <StatsTab />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ─── Full Surah Reading Mode ───────────────────────────────────────────────

type RecitePhase = 'idle' | 'recording' | 'transcribing' | 'result'

function SurahReadingView({
  surahNumber, surahName, onBack,
}: {
  surahNumber: number
  surahName: string
  onBack: () => void
}) {
  const { language, reciterIdentifier } = useQuranStore()
  const { data: surah, isLoading } = useSurah(surahNumber, language)
  const [verseIdx, setVerseIdx] = useState(0)
  const [phase, setPhase] = useState<RecitePhase>('idle')
  const [result, setResult] = useState<TranscribeResult | null>(null)
  const [rated, setRated] = useState(false)

  const transcribe = useTranscribeVerse()
  const submitReview = useSubmitReview()
  const { recording, audioBlob, startRecording, stopRecording, reset } = useAudioRecorder()
  const { play, pause, isPlaying, currentVerse: audioVerse, currentSurah: audioSurah } = useAudioStore()
  const pendingVerseId = useRef<number | null>(null)

  const verses = surah?.verses ?? []
  const verse = verses[verseIdx]
  const total = verses.length

  useEffect(() => {
    if (!audioBlob || pendingVerseId.current === null) return
    const vid = pendingVerseId.current
    setPhase('transcribing')
    transcribe.mutateAsync({ verse_id: vid, audio: audioBlob })
      .then(r => { setResult(r); setPhase('result') })
      .catch(() => { setResult(null); setPhase('result') })
      .finally(() => { reset(); pendingVerseId.current = null })
  }, [audioBlob])

  async function handleRecord() {
    if (!verse) return
    setResult(null)
    setRated(false)
    pendingVerseId.current = verse.id
    try {
      await startRecording()
      setPhase('recording')
    } catch {
      pendingVerseId.current = null
    }
  }

  function handleStop() {
    stopRecording()
  }

  async function handleRate(quality: number) {
    if (!verse || rated) return
    setRated(true)
    try {
      await submitReview.mutateAsync({ verse_id: verse.id, quality })
    } catch { /* noop */ }
  }

  function handleNext() {
    if (verseIdx + 1 < total) {
      setVerseIdx(i => i + 1)
      setPhase('idle')
      setResult(null)
      setRated(false)
      reset()
    }
  }

  function handlePrev() {
    if (verseIdx > 0) {
      setVerseIdx(i => i - 1)
      setPhase('idle')
      setResult(null)
      setRated(false)
      reset()
    }
  }

  function handlePlayVerse() {
    if (!verse) return
    const isVerseAudioPlaying = isPlaying && audioSurah === surahNumber && audioVerse === verse.number
    if (isVerseAudioPlaying) { pause(); return }
    const url = `https://cdn.islamic.network/quran/audio/128/${reciterIdentifier}/${String(surahNumber).padStart(3, '0')}${String(verse.number).padStart(3, '0')}.mp3`
    play(surahNumber, verse.number, url)
  }

  const isVerseAudioPlaying = verse
    ? isPlaying && audioSurah === surahNumber && audioVerse === verse.number
    : false

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-full items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (!verse) {
    return (
      <div className="flex flex-col min-h-full items-center justify-center gap-4 px-6">
        <CheckCircle2 size={48} className="text-emerald-400" />
        <p className="text-text-primary font-medium text-lg">Sura tugadi!</p>
        <button onClick={onBack} className="px-5 py-2.5 bg-accent/10 border border-accent/30 rounded-xl text-accent text-sm font-medium">
          Suralar ro'yxatiga
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-3">
        <button
          onClick={onBack}
          className="p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-bg-elevated transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-text-primary font-semibold truncate">{surahName}</p>
          <p className="text-text-muted text-xs">{verseIdx + 1} / {total} oyat</p>
        </div>
        <button
          onClick={handlePlayVerse}
          className={cn(
            'p-2 rounded-xl transition-colors',
            isVerseAudioPlaying
              ? 'bg-accent/20 text-accent'
              : 'text-text-muted hover:text-text-primary hover:bg-bg-elevated'
          )}
        >
          {isVerseAudioPlaying ? <Pause size={16} /> : <Play size={16} />}
        </button>
      </div>

      {/* Progress bar */}
      <div className="mx-4 h-1 bg-bg-elevated rounded-full mb-4">
        <div
          className="h-full bg-accent rounded-full transition-all"
          style={{ width: `${((verseIdx + 1) / total) * 100}%` }}
        />
      </div>

      {/* Verse display */}
      <div className="flex-1 px-4 space-y-4">
        {/* Arabic text */}
        <div className="bg-bg-card border border-border-subtle rounded-2xl p-5">
          {phase === 'result' && result ? (
            <div>
              <div className="flex flex-wrap gap-x-2 gap-y-1 justify-end" dir="rtl">
                {result.words.map((w, i) => (
                  <span
                    key={i}
                    className={cn(
                      'font-arabic text-2xl leading-loose',
                      w.correct ? 'text-emerald-400' : 'text-red-400'
                    )}
                  >
                    {w.text}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border-subtle">
                <span className="text-xs text-text-muted">Moslik</span>
                <span className={cn(
                  'text-xl font-bold',
                  result.match_percent >= 80 ? 'text-emerald-400'
                    : result.match_percent >= 50 ? 'text-yellow-400'
                    : 'text-red-400'
                )}>
                  {result.match_percent}%
                </span>
              </div>
            </div>
          ) : (
            <p
              className="font-arabic text-text-arabic text-2xl leading-loose text-right"
              dir="rtl"
            >
              {verse.text_arabic}
            </p>
          )}
        </div>

        {/* Translation */}
        {surah && (() => {
          const tr = verse.translations?.find(t => t.language === language)?.text || verse.translation
          return tr ? (
            <p className="text-text-secondary text-sm leading-relaxed px-1">{tr}</p>
          ) : null
        })()}

        {/* Recording state */}
        <AnimatePresence mode="wait">
          {phase === 'idle' && (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleRecord}
                className="w-full flex items-center justify-center gap-2 py-4 bg-accent/10 border border-accent/30 rounded-xl text-accent font-medium hover:bg-accent/20 transition-colors"
              >
                <Mic size={18} />
                Qiroat qilish
              </motion.button>
            </motion.div>
          )}

          {phase === 'recording' && (
            <motion.div key="recording" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="flex flex-col items-center gap-3 py-2">
                <motion.div
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="w-16 h-16 rounded-full bg-red-400/20 flex items-center justify-center"
                >
                  <Mic size={26} className="text-red-400" />
                </motion.div>
                <p className="text-red-400 text-sm font-medium">Yozilmoqda...</p>
              </div>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleStop}
                className="w-full flex items-center justify-center gap-2 py-4 bg-red-400/10 border border-red-400/30 rounded-xl text-red-400 font-medium hover:bg-red-400/20 transition-colors"
              >
                <MicOff size={18} />
                To'xtatish
              </motion.button>
            </motion.div>
          )}

          {phase === 'transcribing' && (
            <motion.div key="transcribing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-3 py-4">
              <Spinner />
              <p className="text-text-muted text-sm">Tekshirilmoqda...</p>
            </motion.div>
          )}

          {phase === 'result' && (
            <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
              {!rated && (
                <div className="space-y-2">
                  <p className="text-text-muted text-xs text-center">Qanday esladingiz?</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { quality: 5, label: 'Mukammal', color: 'bg-emerald-400/10 border-emerald-400/30 text-emerald-400' },
                      { quality: 4, label: 'Yaxshi', color: 'bg-blue-400/10 border-blue-400/30 text-blue-400' },
                      { quality: 2, label: "Qiyin bo'ldi", color: 'bg-yellow-400/10 border-yellow-400/30 text-yellow-400' },
                      { quality: 0, label: 'Unutdim', color: 'bg-red-400/10 border-red-400/30 text-red-400' },
                    ].map(({ quality, label, color }) => (
                      <motion.button
                        key={quality}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => handleRate(quality)}
                        className={cn('py-3 rounded-xl border text-sm font-medium transition-all', color)}
                      >
                        {label}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}
              <button
                onClick={handleRecord}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 text-text-muted text-sm hover:text-accent transition-colors"
              >
                <Mic size={13} />
                Qayta o'qi
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom navigation */}
      <div className="flex items-center gap-3 px-4 pb-6 pt-4">
        <button
          onClick={handlePrev}
          disabled={verseIdx === 0}
          className="flex items-center gap-1.5 px-4 py-3 rounded-xl text-sm text-text-muted hover:text-accent hover:bg-bg-elevated disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={16} />
          Oldingi
        </button>

        <div className="flex-1 text-center">
          <span className="text-text-muted text-xs tabular-nums">
            {verseIdx + 1} / {total}
          </span>
        </div>

        <button
          onClick={handleNext}
          disabled={verseIdx >= total - 1}
          className="flex items-center gap-1.5 px-4 py-3 rounded-xl text-sm text-text-muted hover:text-accent hover:bg-bg-elevated disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          Keyingi
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}

// ─── Due Verses Review ─────────────────────────────────────────────────────

type ReviewPhase = 'hidden' | 'recording' | 'transcribing' | 'revealed'

function ReviewList({ verses }: { verses: HifzProgress[] }) {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [phase, setPhase] = useState<ReviewPhase>('hidden')
  const [blindMode, setBlindMode] = useState(false)
  const [transcribeResult, setTranscribeResult] = useState<TranscribeResult | null>(null)
  const submitReview = useSubmitReview()
  const transcribe = useTranscribeVerse()
  const { recording, audioBlob, startRecording, stopRecording, reset } = useAudioRecorder()
  const { play, pause, isPlaying, currentVerse: audioVerse, currentSurah: audioSurah } = useAudioStore()
  const { reciterIdentifier } = useQuranStore()
  const pendingVerseId = useRef<number | null>(null)

  useEffect(() => {
    if (!audioBlob || pendingVerseId.current === null) return
    const vid = pendingVerseId.current
    setPhase('transcribing')
    transcribe.mutateAsync({ verse_id: vid, audio: audioBlob })
      .then(r => { setTranscribeResult(r); setPhase('revealed') })
      .catch(() => setPhase('revealed'))
      .finally(() => { reset(); pendingVerseId.current = null })
  }, [audioBlob])

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
    if (isVerseAudioPlaying) { pause(); return }
    const url = `https://cdn.islamic.network/quran/audio/128/${reciterIdentifier}/${String(verse.surah_number).padStart(3, '0')}${String(verse.verse_number).padStart(3, '0')}.mp3`
    play(verse.surah_number, verse.verse_number, url)
  }

  async function handleStartRecording() {
    setTranscribeResult(null)
    pendingVerseId.current = verse.id
    try {
      await startRecording()
      setPhase('recording')
    } catch {
      pendingVerseId.current = null
    }
  }

  async function handleQuality(quality: number) {
    try {
      await submitReview.mutateAsync({ verse_id: verse.id, quality })
    } catch { /* noop */ }
    setPhase('hidden')
    setTranscribeResult(null)
    setCurrentIdx(i => i + 1)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-text-muted text-sm">{currentIdx + 1} / {verses.length}</span>
        <div className="flex items-center gap-2">
          {!blindMode && phase === 'hidden' && (
            <span className="text-text-muted text-xs font-mono">{verse.surah_number}:{verse.verse_number}</span>
          )}
          <button
            onClick={() => { setBlindMode(b => !b); setPhase('hidden'); setTranscribeResult(null) }}
            className={cn(
              'flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition-colors',
              blindMode ? 'bg-accent/20 text-accent' : 'text-text-muted hover:text-text-secondary bg-bg-elevated'
            )}
          >
            {blindMode ? <EyeOff size={11} /> : <Eye size={11} />}
            {blindMode ? 'Blind' : 'Hint'}
          </button>
        </div>
      </div>

      <div className="bg-bg-card border border-border-subtle rounded-2xl p-5 min-h-[140px] flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {phase === 'hidden' && (
            <motion.div key="hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-3 py-4">
              <Mic size={28} className="text-text-muted/40" />
              <p className="text-text-muted text-sm">Oyatni qiroat qiling</p>
              {!blindMode && (
                <p className="text-text-muted/50 text-xs font-mono">{verse.surah_number}:{verse.verse_number}</p>
              )}
            </motion.div>
          )}

          {phase === 'recording' && (
            <motion.div key="recording" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-3 py-4">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="w-14 h-14 rounded-full bg-red-400/20 flex items-center justify-center"
              >
                <Mic size={24} className="text-red-400" />
              </motion.div>
              <p className="text-red-400 text-sm font-medium">Yozilmoqda...</p>
            </motion.div>
          )}

          {phase === 'transcribing' && (
            <motion.div key="transcribing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-3 py-4">
              <Spinner />
              <p className="text-text-muted text-sm">Tekshirilmoqda...</p>
            </motion.div>
          )}

          {phase === 'revealed' && (
            <motion.div key="revealed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {transcribeResult ? (
                <div>
                  <div className="flex flex-wrap gap-x-2 gap-y-1 justify-end" dir="rtl">
                    {transcribeResult.words.map((w, i) => (
                      <span key={i} className={cn('font-arabic text-2xl leading-loose', w.correct ? 'text-emerald-400' : 'text-red-400')}>
                        {w.text}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border-subtle">
                    <span className="text-xs text-text-muted">Moslik</span>
                    <span className={cn('text-lg font-bold',
                      transcribeResult.match_percent >= 80 ? 'text-emerald-400'
                        : transcribeResult.match_percent >= 50 ? 'text-yellow-400'
                        : 'text-red-400'
                    )}>
                      {transcribeResult.match_percent}%
                    </span>
                  </div>
                </div>
              ) : (
                <p className="font-arabic text-text-arabic text-2xl leading-loose text-right" dir="rtl">
                  {verse.text_arabic}
                </p>
              )}
              <div className="flex justify-end gap-2 mt-3">
                <button
                  onClick={handleStartRecording}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-bg-elevated text-text-muted hover:text-accent transition-colors"
                >
                  <Mic size={12} />
                  Qayta o'qi
                </button>
                <button
                  onClick={handlePlayVerse}
                  className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors',
                    isVerseAudioPlaying ? 'bg-accent text-bg-primary' : 'bg-bg-elevated text-text-muted hover:text-accent'
                  )}
                >
                  {isVerseAudioPlaying ? <Pause size={12} /> : <Play size={12} />}
                  {isVerseAudioPlaying ? "To'xtat" : 'Tinglash'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {phase === 'hidden' && (
        <div className="space-y-2">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleStartRecording}
            className="w-full flex items-center justify-center gap-2 py-4 bg-accent/10 border border-accent/30 rounded-xl text-accent font-medium hover:bg-accent/20 transition-colors"
          >
            <Mic size={18} />
            Qiroat qilish
          </motion.button>
          <button
            onClick={() => setPhase('revealed')}
            className="w-full flex items-center justify-center gap-2 py-2.5 text-text-muted text-sm hover:text-text-secondary transition-colors"
          >
            <Eye size={14} />
            {blindMode ? "Ko'rsatish" : "Ovoz yozmasdan ko'rsatish"}
          </button>
        </div>
      )}

      {phase === 'recording' && (
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => stopRecording()}
          className="w-full flex items-center justify-center gap-2 py-4 bg-red-400/10 border border-red-400/30 rounded-xl text-red-400 font-medium hover:bg-red-400/20 transition-colors"
        >
          <MicOff size={18} />
          To'xtatish
        </motion.button>
      )}

      {phase === 'transcribing' && (
        <div className="w-full py-4 flex justify-center">
          <span className="text-text-muted text-sm">Natija kutilmoqda...</span>
        </div>
      )}

      {phase === 'revealed' && (
        <div className="space-y-2">
          <p className="text-text-muted text-xs text-center">Qanday esladingiz?</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { quality: 5, label: 'Mukammal', color: 'bg-emerald-400/10 border-emerald-400/30 text-emerald-400' },
              { quality: 4, label: 'Yaxshi esladim', color: 'bg-blue-400/10 border-blue-400/30 text-blue-400' },
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

// ─── Other components ──────────────────────────────────────────────────────

function StatsTab() {
  const { data: dashboard, isLoading } = useHifzDashboard()
  if (isLoading) return <div className="flex justify-center py-12"><Spinner /></div>
  if (!dashboard) return null

  const maxReviews = Math.max(...dashboard.daily_reviews.map(d => d.count), 1)
  const statusItems = [
    { key: 'memorized', label: 'Yodlangan', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { key: 'learning', label: "O'rganilmoqda", color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { key: 'weak', label: 'Zaif', color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
    { key: 'new', label: 'Yangi', color: 'text-text-muted', bg: 'bg-bg-elevated' },
  ] as const

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {statusItems.map(item => (
          <div key={item.key} className={cn('rounded-xl p-3 border border-transparent', item.bg)}>
            <p className={cn('font-bold text-2xl', item.color)}>{dashboard.status_counts[item.key]}</p>
            <p className="text-text-muted text-xs mt-0.5">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-bg-card border border-border-subtle rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 size={14} className="text-text-muted" />
          <span className="text-text-secondary text-sm font-medium">7 kunlik takror</span>
        </div>
        <div className="flex items-end gap-1.5 h-20">
          {dashboard.daily_reviews.map(day => (
            <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex flex-col justify-end" style={{ height: '56px' }}>
                <div
                  className="w-full bg-accent/60 rounded-t-sm transition-all"
                  style={{ height: `${Math.max((day.count / maxReviews) * 100, day.count > 0 ? 8 : 0)}%` }}
                />
              </div>
              <span className="text-[9px] text-text-muted leading-none">{day.label}</span>
              {day.count > 0 && <span className="text-[9px] text-accent leading-none">{day.count}</span>}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-bg-card border border-border-subtle rounded-xl p-4">
        <p className="text-text-secondary text-sm font-medium mb-3">Top suralar</p>
        {dashboard.top_surahs.length === 0 ? (
          <p className="text-text-muted text-xs text-center py-4">Hali yodlanmagan</p>
        ) : (
          <div className="space-y-2">
            {dashboard.top_surahs.map(s => (
              <div key={s.surah_number} className="flex items-center gap-3">
                <span className="text-xs text-text-muted w-5 text-right">{s.surah_number}</span>
                <div className="flex-1">
                  <div className="flex justify-between mb-0.5">
                    <span className="text-xs text-text-primary">{s.surah_name}</span>
                    <span className="text-xs text-accent">{s.percent}%</span>
                  </div>
                  <div className="h-1.5 bg-bg-elevated rounded-full overflow-hidden">
                    <div className="h-full bg-accent rounded-full" style={{ width: `${s.percent}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-bg-card border border-border-subtle rounded-xl p-4 flex items-center gap-4">
        <div>
          <p className="text-text-muted text-xs">Jami oyatlar</p>
          <p className="text-text-primary font-bold text-xl">{dashboard.total_in_progress}</p>
        </div>
        <div className="w-px h-8 bg-border-subtle" />
        <div>
          <p className="text-text-muted text-xs">Bugun takror</p>
          <p className="text-accent font-bold text-xl">{dashboard.due_count}</p>
        </div>
      </div>
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
      error.error_type === 'RED' ? 'bg-red-400/5 border-red-400/20' : 'bg-yellow-400/5 border-yellow-400/20'
    )}>
      <div className="flex items-center justify-between mb-1">
        <span className={cn('text-xs font-medium', error.error_type === 'RED' ? 'text-red-400' : 'text-yellow-400')}>
          {error.error_type === 'RED' ? 'Katta xato' : 'Kichik xato'}
        </span>
        <span className="text-text-muted text-xs">{error.surah_number}:{error.verse_number}</span>
      </div>
      <p className="font-arabic text-text-arabic text-base leading-relaxed text-right" dir="rtl">{error.text_arabic}</p>
      {error.notes && <p className="text-text-muted text-xs mt-1">{error.notes}</p>}
    </div>
  )
}
