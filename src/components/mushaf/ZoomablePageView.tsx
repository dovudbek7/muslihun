import { useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { buildRoute } from '@/constants/routes'
import { usePage, useSurahs } from '@/api/quran'
import { useQuranStore } from '@/stores/quranStore'
import { useMushafStore } from '@/stores/mushafStore'
import { MushafPage } from '@/components/quran/MushafPage'

const TOTAL_PAGES = 604
const MIN_ZOOM = 0.8
const MAX_ZOOM = 3
const MIN_SWIPE = 50
const DOUBLE_TAP_MS = 300

interface Props {
  page: number
  fontSize: number
}

export function ZoomablePageView({ page, fontSize }: Props) {
  const navigate = useNavigate()
  const { language } = useQuranStore()
  const { zoom, setZoom } = useMushafStore()
  const { data: pageData } = usePage(page, language)
  const { data: allSurahs } = useSurahs(language)

  const containerRef = useRef<HTMLDivElement>(null)
  const lastDist = useRef<number | null>(null)
  const lastTapTime = useRef(0)
  const touchStartX = useRef(0)
  const touchStartY = useRef(0)
  const isPinching = useRef(false)

  // Non-passive touchmove handler to allow e.preventDefault() — blocks browser pinch zoom
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const handler = (e: TouchEvent) => {
      if (e.touches.length >= 2) e.preventDefault()
    }
    el.addEventListener('touchmove', handler, { passive: false })
    return () => el.removeEventListener('touchmove', handler)
  }, [])

  const getTouchDist = (e: React.TouchEvent) => {
    const [t1, t2] = [e.touches[0], e.touches[1]]
    return Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY)
  }

  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      lastDist.current = getTouchDist(e)
      isPinching.current = true
    } else {
      touchStartX.current = e.touches[0].clientX
      touchStartY.current = e.touches[0].clientY
    }
  }

  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length !== 2 || lastDist.current === null) return
    const dist = getTouchDist(e)
    const factor = dist / lastDist.current
    lastDist.current = dist
    // getState() avoids stale closure — always reads current zoom
    const cur = useMushafStore.getState().zoom
    setZoom(Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, cur * factor)))
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && lastDist.current !== null) {
      // 2 → 1 finger: still ending pinch, reset dist but keep isPinching flag
      lastDist.current = null
      return
    }
    if (e.touches.length === 0) {
      if (isPinching.current) {
        isPinching.current = false
        lastDist.current = null
        return
      }
      // Double-tap → reset zoom
      const now = Date.now()
      if (now - lastTapTime.current < DOUBLE_TAP_MS) {
        setZoom(1)
        lastTapTime.current = 0
        return
      }
      lastTapTime.current = now

      // Swipe navigation
      const diffX = touchStartX.current - e.changedTouches[0].clientX
      const diffY = Math.abs(e.changedTouches[0].clientY - touchStartY.current)
      if (Math.abs(diffX) >= MIN_SWIPE && diffY < 60) {
        if (diffX > 0 && page < TOTAL_PAGES) navigate(buildRoute.page(page + 1))
        else if (diffX < 0 && page > 1) navigate(buildRoute.page(page - 1))
      }
    }
  }

  return (
    <div
      ref={containerRef}
      className="flex flex-col overflow-hidden select-none"
      style={{ height: 'calc(100dvh - 7.5rem)', touchAction: 'none' }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="flex-1 overflow-hidden min-h-0 px-2 py-2 flex items-start justify-center">
        <div
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'top center',
            transition: zoom === 1 ? 'transform 0.2s' : 'none',
            width: '100%',
          }}
        >
          {pageData?.verses.length ? (
            <MushafPage
              verses={pageData.verses}
              fontSize={fontSize}
              pageNumber={page}
              side="single"
              allSurahs={allSurahs}
            />
          ) : (
            <div className="flex items-center justify-center" style={{ minHeight: '70vh' }}>
              <span className="text-text-muted text-sm">Yuklanmoqda...</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between flex-shrink-0 py-1 px-4">
        <span className="text-text-muted/60 text-xs tabular-nums font-arabic">
          {page} / {TOTAL_PAGES}
        </span>
        {zoom !== 1 && (
          <span className="text-text-muted text-xs tabular-nums">
            {Math.round(zoom * 100)}%
          </span>
        )}
      </div>
    </div>
  )
}
