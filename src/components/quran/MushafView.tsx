import { useEffect, useCallback, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { buildRoute } from '@/constants/routes'
import { usePage, useSurahs } from '@/api/quran'
import { useQuranStore } from '@/stores/quranStore'
import { MushafPage } from './MushafPage'
import { VerseActionSheet } from './VerseActionSheet'
import type { Verse, Surah } from '@/types/quran'

const TOTAL_PAGES = 604
const MUSHAF_BG = 'var(--mushaf-bg, linear-gradient(135deg, #1a1208 0%, #120F0E 50%, #1a1208 100%))'
const MIN_SWIPE = 50

function useIsDualPage() {
  const [dual, setDual] = useState(() => typeof window !== 'undefined' && window.innerWidth >= 768)
  useEffect(() => {
    const h = () => setDual(window.innerWidth >= 768)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])
  return dual
}

interface Props {
  verses: Verse[]
  fontSize: number
  page: number
  surah?: Surah
  isFullscreen?: boolean
}

export function MushafView({ fontSize, page, isFullscreen = false }: Props) {
  const navigate = useNavigate()
  const { language, openRecitation, closeRecitation } = useQuranStore()
  const isDual = useIsDualPage()

  const [selectedVerse, setSelectedVerse] = useState<Verse | null>(null)
  const touchStartX = useRef(0)

  // Always land on odd page as "right" page
  const spreadStart = page % 2 === 1 ? page : page - 1
  const rightPage = spreadStart
  const leftPage = spreadStart + 1

  const { data: rightData } = usePage(rightPage, language)
  const { data: leftData } = usePage(leftPage, language)
  const { data: allSurahs } = useSurahs(language)

  // Prefetch adjacent spreads
  usePage(Math.max(1, spreadStart - 2), language)
  usePage(Math.max(1, spreadStart - 1), language)
  usePage(Math.min(TOTAL_PAGES, spreadStart + 2), language)
  usePage(Math.min(TOTAL_PAGES, spreadStart + 3), language)

  const goTo = useCallback((p: number) => {
    if (p < 1 || p > TOTAL_PAGES) return
    navigate(buildRoute.page(p))
  }, [navigate])

  const goPrev = useCallback(() => {
    goTo(isDual ? spreadStart - 2 : page - 1)
  }, [goTo, isDual, spreadStart, page])

  const goNext = useCallback(() => {
    goTo(isDual ? leftPage + 1 : page + 1)
  }, [goTo, isDual, leftPage, page])

  const canPrev = isDual ? spreadStart > 1 : page > 1
  const canNext = isDual ? leftPage < TOTAL_PAGES : page < TOTAL_PAGES

  // Keyboard: ArrowLeft = next (RTL), ArrowRight = prev (RTL)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') { if (canNext) goNext() }
      if (e.key === 'ArrowRight') { if (canPrev) goPrev() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goNext, goPrev, canNext, canPrev])

  // Touch swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) < MIN_SWIPE) return
    if (diff > 0 && canNext) goNext()   // swipe left → next pages (RTL forward)
    else if (diff < 0 && canPrev) goPrev() // swipe right → prev pages (RTL back)
  }

  // Find surah for a verse by page number
  const getSurahForPage = useCallback((pageNum: number): Surah | null => {
    if (!allSurahs) return null
    return allSurahs
      .filter(s => s.page_start <= pageNum)
      .sort((a, b) => b.page_start - a.page_start)[0] ?? null
  }, [allSurahs])

  const rightSurah = getSurahForPage(rightPage)
  const leftSurah = getSurahForPage(leftPage)

  const handleVerseClick = useCallback((verse: Verse, pageNum: number) => {
    const surah = getSurahForPage(pageNum)
    // attach surah_number to verse for action sheet
    setSelectedVerse({ ...verse, surah_number: surah?.number ?? verse.surah_number })
  }, [getSurahForPage])

  const height = isFullscreen ? '100dvh' : 'calc(100dvh - 7.5rem)'

  return (
    <>
      <div
        className="flex flex-col px-2 py-2 gap-1.5"
        style={{ height }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Pages area */}
        <div className="flex flex-1 gap-0 min-h-0">
          {isDual ? (
            <>
              {/* Left page (higher page number — Arabic left side) */}
              <div className="flex-1 min-w-0 min-h-0">
                {leftData?.verses.length ? (
                  <MushafPage
                    verses={leftData.verses}
                    fontSize={fontSize - 2}
                    pageNumber={leftPage}
                    side="left"
                    allSurahs={allSurahs}
                    onVerseClick={(v) => handleVerseClick(v, leftPage)}
                  />
                ) : (
                  <div className="h-full rounded-l-xl" style={{ background: MUSHAF_BG }} />
                )}
              </div>

              {/* Book spine */}
              <div className="w-3 flex-shrink-0 relative">
                <div className="absolute inset-y-0 left-1/2 w-px bg-emerald-900/20 -translate-x-1/2" />
                <div
                  className="absolute inset-y-0 left-1/2 -translate-x-[2px] w-[5px]"
                  style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.12), rgba(0,0,0,0.22), rgba(0,0,0,0.04))' }}
                />
              </div>

              {/* Right page (lower page number — Arabic right side) */}
              <div className="flex-1 min-w-0 min-h-0">
                {rightData?.verses.length ? (
                  <MushafPage
                    verses={rightData.verses}
                    fontSize={fontSize - 2}
                    pageNumber={rightPage}
                    side="right"
                    allSurahs={allSurahs}
                    onVerseClick={(v) => handleVerseClick(v, rightPage)}
                  />
                ) : (
                  <div className="h-full rounded-r-xl" style={{ background: MUSHAF_BG }} />
                )}
              </div>
            </>
          ) : (
            /* Single page — mobile */
            <div className="flex-1 min-w-0 min-h-0">
              {rightData?.verses.length ? (
                <MushafPage
                  verses={rightData.verses}
                  fontSize={fontSize}
                  pageNumber={rightPage}
                  side="single"
                  allSurahs={allSurahs}
                  onVerseClick={(v) => handleVerseClick(v, rightPage)}
                />
              ) : (
                <div className="h-full rounded-xl" style={{ background: MUSHAF_BG }} />
              )}
            </div>
          )}
        </div>

        {/* Page indicator only — no nav buttons (swipe to navigate) */}
        <div className="flex items-center justify-center flex-shrink-0 py-0.5">
          <span className="text-text-muted/60 text-xs tabular-nums font-arabic">
            {isDual ? `${rightPage}–${leftPage}` : rightPage} / {TOTAL_PAGES}
          </span>
        </div>
      </div>

      {/* FAB — Layout da boshqariladi, shu yerda event dispatch qilinadi */}

      {/* Verse action bottom sheet */}
      <VerseActionSheet
        verse={selectedVerse}
        surah={selectedVerse ? (getSurahForPage(selectedVerse.page_number ?? rightPage) ?? rightSurah) : null}
        onClose={() => setSelectedVerse(null)}
        onRecite={() => {
          if (selectedVerse) {
            const surah = getSurahForPage(selectedVerse.page_number ?? rightPage)
            openRecitation(surah?.number ?? 1, selectedVerse.number, selectedVerse.text_arabic)
          }
          setSelectedVerse(null)
        }}
      />
    </>
  )
}
