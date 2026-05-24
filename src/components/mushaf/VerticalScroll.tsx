import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useAudioStore } from '@/stores/audioStore'
import { useQuranStore } from '@/stores/quranStore'
import type { Verse, Surah } from '@/types/quran'

const AR = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩']
const toAr = (n: number) => String(n).split('').map(d => AR[+d]).join('')
const MIN_SWIPE = 45

interface Props {
  verses: Verse[]
  surah?: Surah | null
  fontSize: number
}

function SurahHeader({ surah }: { surah: Surah }) {
  return (
    <div className="flex flex-col items-center gap-2 pt-5 pb-3">
      <div className="flex items-center gap-3 w-full max-w-[240px]">
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, #C9A84C50)' }} />
        <span style={{ color: '#C9A84C50' }} className="text-[10px] select-none">❖</span>
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, #C9A84C50)' }} />
      </div>
      <div
        className="rounded-xl overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #C9A84C 0%, #A67C30 50%, #C9A84C 100%)', padding: '1.5px' }}
      >
        <div
          className="rounded-[10px] flex flex-col items-center py-2 px-8"
          style={{ background: 'linear-gradient(135deg, #1a0e04 0%, #110b03 100%)' }}
        >
          <p
            className="font-arabic text-center leading-snug font-bold"
            style={{ fontSize: 16, color: '#C9A84C' }}
            dir="rtl"
          >
            سُورَةُ {surah.name_arabic}
          </p>
          <p style={{ fontSize: 9, color: '#C9A84C', opacity: 0.65 }} className="mt-0.5">
            {surah.name_transliteration} • {surah.total_verses} آية
          </p>
        </div>
      </div>
    </div>
  )
}

export function VerticalScroll({ verses, surah, fontSize }: Props) {
  const { reciterIdentifier, currentVerse: storeVerse, currentSurah } = useQuranStore()
  const { play, currentVerse: audioVerse, currentSurah: audioSurah } = useAudioStore()

  const [idx, setIdx] = useState(() => {
    const saved = storeVerse > 0 ? storeVerse - 1 : 0
    return Math.min(saved, Math.max(0, verses.length - 1))
  })
  const [dir, setDir] = useState<1 | -1>(1)
  const touchStartX = useRef(0)
  const surahNum = surah?.number ?? 1

  useEffect(() => {
    if (verses.length === 0) return
    const target = storeVerse > 0 ? storeVerse - 1 : 0
    const clamped = Math.min(target, verses.length - 1)
    setIdx(clamped)
  }, [surahNum])

  const go = useCallback((next: number) => {
    if (next < 0 || next >= verses.length) return
    setDir(next > idx ? 1 : -1)
    setIdx(next)
  }, [idx, verses.length])

  const goNext = useCallback(() => go(idx + 1), [go, idx])
  const goPrev = useCallback(() => go(idx - 1), [go, idx])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goNext()
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') goPrev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goNext, goPrev])

  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX }
  const onTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) < MIN_SWIPE) return
    if (diff > 0) goNext()
    else goPrev()
  }

  const verse = verses[idx]
  const isAudioActive = audioSurah === surahNum && audioVerse === verse?.number

  if (verses.length === 0) {
    return (
      <div className="flex items-center justify-center" style={{ height: 'calc(100dvh - 7.5rem)', background: '#0f0a05' }}>
        <p style={{ color: '#C9A84C60', fontSize: 14 }}>Yuklanmoqda...</p>
      </div>
    )
  }

  const hasBismillah = surah && surah.number !== 1 && surah.number !== 9 && idx === 0

  return (
    <div
      className="flex flex-col select-none"
      style={{ height: 'calc(100dvh - 7.5rem)', background: 'linear-gradient(180deg, #0f0a05 0%, #1a120a 100%)' }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Surah header */}
      {surah && <SurahHeader surah={surah} />}

      {/* Bismillah */}
      {hasBismillah && (
        <p
          className="font-arabic text-center"
          style={{ fontSize: fontSize - 2, color: '#E8D5A080', letterSpacing: 1, paddingBottom: 8 }}
          dir="rtl"
        >
          بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
        </p>
      )}

      {/* Verse area */}
      <div className="flex-1 flex items-center justify-center px-5 overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: dir * 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -30 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="w-full flex flex-col items-center gap-4"
            onClick={() => {
              const url = `https://cdn.islamic.network/quran/audio/128/${reciterIdentifier}/${String(surahNum).padStart(3,'0')}${String(verse.number).padStart(3,'0')}.mp3`
              play(surahNum, verse.number, url)
            }}
          >
            {/* Arabic text */}
            <p
              className="font-arabic text-center leading-loose cursor-pointer transition-colors"
              style={{
                fontSize: fontSize + 4,
                color: isAudioActive ? '#F5C842' : '#F5EDD0',
                direction: 'rtl',
                lineHeight: 2.4,
              }}
              dir="rtl"
            >
              {verse.text_arabic}
              {' '}
              <span style={{ fontSize: (fontSize + 4) * 0.55, color: '#C9A84C' }}>
                ﴿{toAr(verse.number)}﴾
              </span>
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom nav */}
      <div
        className="flex items-center justify-between px-6 py-4 flex-shrink-0"
        style={{ borderTop: '1px solid #C9A84C15' }}
      >
        <button
          onClick={goPrev}
          disabled={idx === 0}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-opacity disabled:opacity-25"
          style={{ background: '#C9A84C18', color: '#C9A84C' }}
        >
          <ChevronRight size={18} />
        </button>

        <div className="flex flex-col items-center gap-0.5">
          <span style={{ color: '#C9A84C', fontSize: 13, fontWeight: 600 }}>
            {toAr(verse.number)} / {toAr(verses.length)}
          </span>
          <div className="flex gap-1 items-center">
            <div className="w-16 h-0.5 rounded-full overflow-hidden" style={{ background: '#C9A84C20' }}>
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${((idx + 1) / verses.length) * 100}%`, background: '#C9A84C' }}
              />
            </div>
          </div>
        </div>

        <button
          onClick={goNext}
          disabled={idx === verses.length - 1}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-opacity disabled:opacity-25"
          style={{ background: '#C9A84C18', color: '#C9A84C' }}
        >
          <ChevronLeft size={18} />
        </button>
      </div>
    </div>
  )
}
