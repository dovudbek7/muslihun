import { useState, useCallback, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ChevronLeft, ChevronRight, Trophy } from 'lucide-react'
import { useSurah } from '@/api/quran'
import { useQuranStore } from '@/stores/quranStore'
import { useRecitationStore } from '@/stores/recitationStore'
import { useRecitation } from '@/hooks/useRecitation'
import { RecitationAyah } from '@/components/quran/RecitationAyah'
import { RecitationControls } from '@/components/quran/RecitationControls'
import { ContinuousVerse } from '@/components/quran/ContinuousVerse'
import { Spinner } from '@/components/ui/Spinner'
import { cn } from '@/components/ui/cn'
import { recordSession, getSurahStats, type SurahStats } from '@/utils/recitationStats'

type Mode = 'single' | 'continuous'

export function Recitation() {
  const { surahId } = useParams<{ surahId: string }>()
  const navigate = useNavigate()
  const { language } = useQuranStore()
  const surahNumber = Number(surahId) || 1

  const { data: surah, isLoading } = useSurah(surahNumber, language)
  const [verseIdx, setVerseIdx] = useState(0)
  const [mode, setMode] = useState<Mode>('single')
  const [surahDone, setSurahDone] = useState(false)
  const [surahStats, setSurahStats] = useState<SurahStats | null>(null)
  const verseIdxRef = useRef(verseIdx)
  verseIdxRef.current = verseIdx

  const { sessionStatus, words, correctCount, errorCount, lastError, startSession, pause, resume, reset } = useRecitationStore()
  const { isListening, isSupported, error, start, stop } = useRecitation()

  const verses = surah?.verses ?? []
  const verse = verses[verseIdx]
  const totalWords = words.length

  // Load stats on mount
  useEffect(() => {
    setSurahStats(getSurahStats(surahNumber))
  }, [surahNumber])

  // Single mode: save stats when verse finishes
  useEffect(() => {
    if (mode !== 'single' || sessionStatus !== 'finished' || totalWords === 0) return
    recordSession({ surahNumber, date: new Date().toISOString(), correctCount, errorCount, totalWords, mode })
    setSurahStats(getSurahStats(surahNumber))
  }, [sessionStatus]) // eslint-disable-line react-hooks/exhaustive-deps

  // Continuous mode: auto-advance or finish surah
  useEffect(() => {
    if (mode !== 'continuous' || sessionStatus !== 'finished') return
    const nextIdx = verseIdxRef.current + 1
    if (nextIdx >= verses.length) {
      recordSession({ surahNumber, date: new Date().toISOString(), correctCount, errorCount, totalWords: words.length, mode })
      setSurahStats(getSurahStats(surahNumber))
      setSurahDone(true)
      return
    }
    const timer = setTimeout(() => {
      setVerseIdx(nextIdx)
      startSession(verses[nextIdx].text_arabic)
      start()
    }, 700)
    return () => clearTimeout(timer)
  }, [sessionStatus, mode, verses, startSession, start]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleStart = useCallback(() => {
    if (!verse) return
    setSurahDone(false)
    startSession(verse.text_arabic)
    start()
  }, [verse, startSession, start])

  const handlePause    = useCallback(() => { pause(); stop() }, [pause, stop])
  const handleResume   = useCallback(() => { resume(); start() }, [resume, start])
  const handleReset    = useCallback(() => { reset(); stop(); setSurahDone(false) }, [reset, stop])

  const changeVerse = useCallback((idx: number) => {
    setVerseIdx(idx); reset(); stop()
  }, [reset, stop])

  const switchMode = useCallback((m: Mode) => {
    setMode(m); setVerseIdx(0); reset(); stop(); setSurahDone(false)
  }, [reset, stop])

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-dvh bg-bg-primary"><Spinner /></div>
  }
  if (!surah || !verse) {
    return <div className="flex items-center justify-center min-h-dvh bg-bg-primary text-text-muted">Sura topilmadi</div>
  }

  return (
    <div className="flex flex-col min-h-dvh bg-bg-primary">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-bg-primary border-b border-border-subtle">
        <div className="flex items-center justify-between px-4 pt-safe-top py-3">
          <button onClick={() => { handleReset(); navigate(-1) }} className="btn-ghost p-2 -ml-2">
            <ArrowLeft size={20} />
          </button>
          <div className="text-center">
            <p className="font-semibold text-text-primary">{surah.name_transliteration}</p>
            <div className="flex items-center justify-center gap-2">
              <p className="text-xs text-text-muted">{verseIdx + 1} / {verses.length} oyat</p>
              {surahStats && (
                <span className="flex items-center gap-0.5 text-xs text-accent">
                  <Trophy size={10} />
                  {surahStats.bestAccuracy}%
                </span>
              )}
            </div>
          </div>
          <div className="w-10" />
        </div>

        {/* Mode tabs */}
        <div className="flex border-t border-border-subtle">
          {(['single', 'continuous'] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => switchMode(m)}
              className={cn(
                'flex-1 py-2.5 text-xs font-medium transition-colors',
                mode === m ? 'text-accent border-b-2 border-accent' : 'text-text-muted hover:text-text-secondary'
              )}
            >
              {m === 'single' ? 'Oyat-oyat' : 'Uzluksiz'}
            </button>
          ))}
        </div>
      </header>

      {/* ── SINGLE MODE ── */}
      {mode === 'single' && (
        <>
          <main className="flex-1 flex flex-col items-center justify-center px-6 py-10 gap-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={verseIdx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="w-full"
              >
                <RecitationAyah arabicText={verse.text_arabic} verseNumber={verse.number} />
              </motion.div>
            </AnimatePresence>

            <AnimatePresence>
              {sessionStatus === 'finished' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full bg-bg-card border border-accent/20 rounded-2xl p-6 text-center space-y-3"
                >
                  <p className="text-3xl text-accent">✓</p>
                  <p className="text-text-primary font-semibold">Oyat tugadi!</p>
                  <p className="text-text-secondary text-sm">
                    {correctCount} to'g'ri · {errorCount} xato ·{' '}
                    <span className="text-accent font-medium">
                      {totalWords > 0 ? Math.round((correctCount / totalWords) * 100) : 0}%
                    </span>
                  </p>
                  {surahStats && surahStats.sessions > 1 && (
                    <p className="text-text-muted text-xs">Eng yaxshi: {surahStats.bestAccuracy}% · {surahStats.sessions} mashq</p>
                  )}
                  <div className="flex gap-3 justify-center pt-1">
                    <button onClick={handleReset} className="btn-ghost text-sm px-4 py-2">Qayta</button>
                    {verseIdx < verses.length - 1 && (
                      <button onClick={() => changeVerse(verseIdx + 1)} className="btn-primary text-sm px-5 py-2">
                        Keyingi oyat
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </main>

          <footer className="px-6 pb-safe-bottom pb-8 pt-4 border-t border-border-subtle space-y-5">
            <div className="flex items-center justify-between">
              <button
                onClick={() => changeVerse(verseIdx - 1)}
                disabled={verseIdx === 0}
                className={cn('btn-ghost p-2', verseIdx === 0 && 'opacity-30 cursor-not-allowed')}
              >
                <ChevronRight size={20} />
              </button>
              <div className="flex gap-1.5 items-center">
                {Array.from({ length: Math.min(7, verses.length) }, (_, i) => {
                  const offset = Math.max(0, Math.min(verseIdx - 3, verses.length - 7))
                  const idx = offset + i
                  return (
                    <button
                      key={idx}
                      onClick={() => idx !== verseIdx && changeVerse(idx)}
                      className={cn(
                        'rounded-full transition-all duration-200',
                        idx === verseIdx ? 'w-5 h-2 bg-accent' : 'w-2 h-2 bg-bg-elevated hover:bg-bg-hover'
                      )}
                    />
                  )
                })}
              </div>
              <button
                onClick={() => changeVerse(verseIdx + 1)}
                disabled={verseIdx === verses.length - 1}
                className={cn('btn-ghost p-2', verseIdx === verses.length - 1 && 'opacity-30 cursor-not-allowed')}
              >
                <ChevronLeft size={20} />
              </button>
            </div>

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
          </footer>
        </>
      )}

      {/* ── CONTINUOUS MODE ── */}
      {mode === 'continuous' && (
        <>
          <div className="flex-1 overflow-y-auto px-5 py-4">
            {verses.map((v, i) => (
              <ContinuousVerse
                key={v.id}
                verse={v}
                state={i < verseIdx ? 'completed' : i === verseIdx ? 'active' : 'upcoming'}
                isScrollTarget={i === verseIdx}
              />
            ))}
          </div>

          {/* Surah done overlay */}
          <AnimatePresence>
            {surahDone && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-bg-primary/90 flex items-center justify-center z-20"
              >
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className="bg-bg-card border border-accent/30 rounded-2xl p-8 text-center space-y-4 mx-6"
                >
                  <p className="text-4xl text-accent">✓</p>
                  <p className="text-text-primary font-semibold text-lg">{surah.name_transliteration} tugadi!</p>
                  <p className="text-text-secondary text-sm">{verses.length} oyat o'qildi</p>
                  {surahStats && (
                    <p className="text-text-muted text-xs">Eng yaxshi: {surahStats.bestAccuracy}% · {surahStats.sessions} mashq</p>
                  )}
                  <div className="flex gap-3 justify-center pt-2">
                    <button onClick={handleReset} className="btn-ghost px-5 py-2.5">Qayta</button>
                    <button onClick={() => { handleReset(); navigate(-1) }} className="btn-primary px-5 py-2.5">Chiqish</button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <footer className="sticky bottom-0 px-6 pb-safe-bottom pb-6 pt-4 border-t border-border-subtle bg-bg-primary">
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
          </footer>
        </>
      )}
    </div>
  )
}
