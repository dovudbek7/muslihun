import { useState, useRef, useCallback, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useQuranStore } from '@/stores/quranStore'
import { useAudioStore } from '@/stores/audioStore'
import { usePage, useSurahs } from '@/api/quran'
import type { Surah } from '@/types/quran'

const TOTAL_PAGES = 604
const MIN_SWIPE = 45

const AR = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩']
const toAr = (n: number) => String(n).split('').map(d => AR[+d]).join('')

const MUSHAF_BG = 'linear-gradient(180deg, #0f0a05 0%, #1a120a 100%)'

interface Props {
  startPage: number
  fontSize: number
}

function SurahBanner({ surah }: { surah: Surah }) {
  const showBismillah = surah.number !== 1 && surah.number !== 9

  return (
    <div className="flex flex-col items-center my-4 gap-2">
      <div className="flex items-center gap-3 w-full max-w-[260px]">
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, #C9A84C50)' }} />
        <span style={{ color: '#C9A84C50' }} className="text-[10px]">❖</span>
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, #C9A84C50)' }} />
      </div>
      <div
        className="rounded-xl overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #C9A84C, #A67C30, #C9A84C)', padding: '1.5px' }}
      >
        <div
          className="rounded-[10px] flex flex-col items-center py-2 px-8"
          style={{ background: 'linear-gradient(135deg, #1a0e04, #110b03)' }}
        >
          <p className="font-arabic text-center font-bold" style={{ fontSize: 15, color: '#C9A84C' }} dir="rtl">
            سُورَةُ {surah.name_arabic}
          </p>
          <p style={{ fontSize: 9, color: '#C9A84C', opacity: 0.65 }} className="mt-0.5">
            {surah.name_transliteration} • {surah.total_verses} آية
          </p>
        </div>
      </div>
      {showBismillah && (
        <p
          className="font-arabic text-center"
          style={{ fontSize: 16, color: '#E8D5A070', letterSpacing: 1 }}
          dir="rtl"
        >
          بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
        </p>
      )}
    </div>
  )
}

export function VerticalScroll({ startPage, fontSize }: Props) {
  const { language, reciterIdentifier } = useQuranStore()
  const { play, currentVerse: audioVerse, currentSurah: audioSurah } = useAudioStore()

  const [page, setPage] = useState(() => Math.max(1, Math.min(startPage, TOTAL_PAGES)))
  const touchStartX = useRef(0)

  useEffect(() => {
    setPage(Math.max(1, Math.min(startPage, TOTAL_PAGES)))
  }, [startPage])

  const { data: pageData, isLoading } = usePage(page, language)
  const { data: nextData } = usePage(Math.min(page + 1, TOTAL_PAGES), language)   // prefetch
  const { data: prevData } = usePage(Math.max(page - 1, 1), language)             // prefetch
  const { data: allSurahs } = useSurahs(language)
  void nextData; void prevData  // silence unused warnings

  const getSurah = useCallback((surahNum: number): Surah | null =>
    allSurahs?.find(s => s.number === surahNum) ?? null
  , [allSurahs])

  const goTo = useCallback((p: number) => {
    if (p < 1 || p > TOTAL_PAGES) return
    setPage(p)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  const goPrev = useCallback(() => goTo(page - 1), [goTo, page])
  const goNext = useCallback(() => goTo(page + 1), [goTo, page])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') goNext()
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') goPrev()
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

  const verses = pageData?.verses ?? []

  // Group verses with surah break detection
  const sections: { surahNum: number; verses: typeof verses }[] = []
  for (const verse of verses) {
    const surahNum = verse.surah_number ?? 1
    if (sections.length === 0 || sections[sections.length - 1].surahNum !== surahNum) {
      sections.push({ surahNum, verses: [] })
    }
    sections[sections.length - 1].verses.push(verse)
  }

  return (
    <div
      className="flex flex-col"
      style={{ minHeight: 'calc(100dvh - 7.5rem)', background: MUSHAF_BG }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Page indicator top */}
      <div className="flex items-center justify-center pt-3 pb-1 flex-shrink-0">
        <span style={{ color: '#C9A84C60', fontSize: 11 }}>
          {toAr(page)} / {toAr(TOTAL_PAGES)}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 px-5 py-2">
        {isLoading && (
          <div className="flex justify-center items-center h-40">
            <span style={{ color: '#C9A84C60', fontSize: 13 }}>Yuklanmoqda...</span>
          </div>
        )}

        {!isLoading && sections.map(({ surahNum, verses: sv }) => {
          const surah = getSurah(surahNum)
          // Show banner only if this is first verse of the surah (verse.number === 1)
          const showBanner = sv[0]?.number === 1 && surah != null

          return (
            <div key={surahNum}>
              {showBanner && <SurahBanner surah={surah!} />}
              <p
                className="font-arabic text-right select-none"
                style={{
                  fontSize,
                  lineHeight: 2.8,
                  color: '#F5EDD0',
                  direction: 'rtl',
                }}
                dir="rtl"
              >
                {sv.map((verse) => {
                  const isActive = audioSurah === surahNum && audioVerse === verse.number
                  return (
                    <span
                      key={verse.id}
                      className="cursor-pointer transition-colors duration-200"
                      style={{ color: isActive ? '#F5C842' : undefined }}
                      onClick={() => {
                        const url = `https://cdn.islamic.network/quran/audio/128/${reciterIdentifier}/${String(surahNum).padStart(3, '0')}${String(verse.number).padStart(3, '0')}.mp3`
                        play(surahNum, verse.number, url)
                      }}
                    >
                      {verse.text_arabic}
                      {' '}
                      <span style={{ fontSize: fontSize * 0.55, color: '#C9A84C' }}>
                        ﴿{toAr(verse.number)}﴾
                      </span>
                      {' '}
                    </span>
                  )
                })}
              </p>
            </div>
          )
        })}
      </div>

      {/* Bottom nav */}
      <div
        className="flex items-center justify-between px-6 py-4 flex-shrink-0"
        style={{ borderTop: '1px solid #C9A84C15' }}
      >
        <button
          onClick={goPrev}
          disabled={page <= 1}
          className="w-10 h-10 rounded-full flex items-center justify-center disabled:opacity-25 transition-opacity"
          style={{ background: '#C9A84C18', color: '#C9A84C' }}
        >
          <ChevronRight size={18} />
        </button>

        <div className="flex flex-col items-center gap-1">
          <span style={{ color: '#C9A84C', fontSize: 13, fontWeight: 600 }}>
            {toAr(page)} / {toAr(TOTAL_PAGES)}
          </span>
          <div className="w-20 h-0.5 rounded-full overflow-hidden" style={{ background: '#C9A84C20' }}>
            <div
              className="h-full rounded-full"
              style={{ width: `${(page / TOTAL_PAGES) * 100}%`, background: '#C9A84C' }}
            />
          </div>
        </div>

        <button
          onClick={goNext}
          disabled={page >= TOTAL_PAGES}
          className="w-10 h-10 rounded-full flex items-center justify-center disabled:opacity-25 transition-opacity"
          style={{ background: '#C9A84C18', color: '#C9A84C' }}
        >
          <ChevronLeft size={18} />
        </button>
      </div>
    </div>
  )
}
