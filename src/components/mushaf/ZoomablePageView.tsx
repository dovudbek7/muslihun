import { useRef } from 'react'
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

  const lastDist = useRef<number | null>(null)
  const lastTap = useRef(0)
  const touchStartX = useRef(0)
  const isPinching = useRef(false)

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
      isPinching.current = false
    }
  }

  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length !== 2 || lastDist.current === null) return
    const dist = getTouchDist(e)
    const factor = dist / lastDist.current
    lastDist.current = dist
    setZoom(Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom * factor)))
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    if (e.touches.length < 2) {
      lastDist.current = null
      if (!isPinching.current) {
        const diff = touchStartX.current - e.changedTouches[0].clientX
        if (Math.abs(diff) >= MIN_SWIPE) {
          if (diff > 0 && page < TOTAL_PAGES) navigate(buildRoute.page(page + 1))
          else if (diff < 0 && page > 1) navigate(buildRoute.page(page - 1))
        }
      }
      isPinching.current = false
    }
  }

  const onDoubleClick = () => {
    const now = Date.now()
    if (now - lastTap.current < 350) setZoom(1)
    lastTap.current = now
  }

  return (
    <div
      className="flex flex-col overflow-hidden"
      style={{ height: 'calc(100dvh - 7.5rem)' }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onClick={onDoubleClick}
    >
      <div className="flex-1 overflow-auto min-h-0 px-2 py-2">
        <div
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'top center',
            transition: zoom === 1 ? 'transform 0.2s' : 'none',
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
