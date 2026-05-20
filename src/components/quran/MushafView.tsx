import { useEffect, useCallback, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { buildRoute } from '@/constants/routes'
import { usePage, useSurahs } from '@/api/quran'
import { useQuranStore } from '@/stores/quranStore'
import { MushafPage } from './MushafPage'
import type { Verse, Surah } from '@/types/quran'

const TOTAL_PAGES = 604
const MUSHAF_BG = 'var(--mushaf-bg, linear-gradient(135deg, #1a1208 0%, #120F0E 50%, #1a1208 100%))'

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
  const { language } = useQuranStore()
  const isDual = useIsDualPage()

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

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goNext()
      if (e.key === 'ArrowRight') goPrev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goNext, goPrev])

  const height = isFullscreen ? '100dvh' : 'calc(100dvh - 7.5rem)'

  return (
    <div className="flex flex-col px-2 py-2 gap-1.5" style={{ height }}>
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
              />
            ) : (
              <div className="h-full rounded-xl" style={{ background: MUSHAF_BG }} />
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between px-1 flex-shrink-0">
        <button
          onClick={goPrev}
          disabled={!canPrev}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs text-text-muted hover:text-accent hover:bg-accent/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={14} />
          Oldingi
        </button>

        <span className="text-text-muted/60 text-xs tabular-nums">
          {isDual ? `${rightPage}–${leftPage}` : rightPage} / {TOTAL_PAGES}
        </span>

        <button
          onClick={goNext}
          disabled={!canNext}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs text-text-muted hover:text-accent hover:bg-accent/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          Keyingi
          <ChevronLeft size={14} />
        </button>
      </div>
    </div>
  )
}
