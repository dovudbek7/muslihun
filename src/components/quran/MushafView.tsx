import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { buildRoute } from '@/constants/routes'
import { usePage } from '@/api/quran'
import { useQuranStore } from '@/stores/quranStore'
import type { Surah, Verse } from '@/types/quran'

interface MushafViewProps {
  verses: Verse[]
  fontSize: number
  page: number
  surah?: Surah
}

const TOTAL_PAGES = 604
const VERSE_MARKERS = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩']

function toArabicNumerals(n: number): string {
  return String(n).split('').map(d => VERSE_MARKERS[parseInt(d)]).join('')
}

export function MushafView({ verses, fontSize, page, surah }: MushafViewProps) {
  const navigate = useNavigate()
  const { language } = useQuranStore()

  // Silent prefetch adjacent pages
  usePage(page - 1, language)
  usePage(page + 1, language)

  const goTo = (p: number) => {
    if (p < 1 || p > TOTAL_PAGES) return
    navigate(buildRoute.page(p))
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="px-3 py-4"
    >
      <div
        className="relative rounded-2xl overflow-hidden border border-accent/20"
        style={{ background: 'var(--mushaf-bg, linear-gradient(135deg, #1a1208 0%, #120F0E 50%, #1a1208 100%))' }}
      >
        {/* Decorative corner borders */}
        <div className="absolute inset-2 border border-accent/10 rounded-xl pointer-events-none" />
        <div className="absolute inset-3 border border-accent/5 rounded-lg pointer-events-none" />

        {/* Header */}
        <div className="relative flex flex-col items-center py-6 px-4">
          <div className="relative w-full max-w-xs">
            <div
              className="relative flex items-center justify-center py-3 px-6 rounded-xl"
              style={{
                background: 'linear-gradient(135deg, rgba(212,175,55,0.15), rgba(212,175,55,0.05))',
                border: '1px solid rgba(212,175,55,0.3)',
              }}
            >
              <span className="absolute top-0.5 left-2 text-accent/40 text-sm">❧</span>
              <span className="absolute top-0.5 right-2 text-accent/40 text-sm">❧</span>
              <span className="absolute bottom-0.5 left-2 text-accent/40 text-sm rotate-180">❧</span>
              <span className="absolute bottom-0.5 right-2 text-accent/40 text-sm rotate-180">❧</span>

              <div className="text-center">
                {surah ? (
                  <>
                    <p className="font-arabic text-accent text-2xl leading-relaxed">{surah.name_arabic}</p>
                    <p className="text-accent/70 text-xs mt-0.5 tracking-wider">{surah.name_transliteration}</p>
                  </>
                ) : (
                  <p className="text-accent text-sm font-medium tracking-wider">{page}-sahifa</p>
                )}
              </div>
            </div>

            {surah && (
              <div className="flex items-center justify-center gap-4 mt-3">
                <span className="text-text-muted text-xs">{surah.total_verses} oyat</span>
                <span className="text-accent/30">•</span>
                <span className="text-text-muted text-xs capitalize">{surah.revelation_type}</span>
              </div>
            )}
          </div>
        </div>

        {/* Bismillah */}
        {surah && surah.number !== 1 && surah.number !== 9 && (
          <div className="flex justify-center pb-4 px-6">
            <p
              className="font-arabic text-center leading-loose"
              style={{ fontSize: fontSize + 2, color: 'var(--mushaf-text, var(--text-arabic))' }}
              dir="rtl"
            >
              بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
            </p>
          </div>
        )}

        {/* Flowing Arabic text */}
        <div className="px-4 pb-6">
          <p
            className="font-arabic leading-loose text-right"
            style={{ fontSize, lineHeight: '2.6', color: 'var(--mushaf-text, var(--text-arabic))' }}
            dir="rtl"
          >
            {verses.map((verse) => (
              <span key={verse.id}>
                {verse.text_arabic}
                {' '}
                <span
                  className="inline-flex items-center justify-center text-accent/80 mx-0.5"
                  style={{ fontSize: fontSize * 0.7 }}
                >
                  ﴿{toArabicNumerals(verse.number)}﴾
                </span>
                {' '}
              </span>
            ))}
          </p>
        </div>

        {/* Page navigation */}
        <div className="flex items-center justify-between px-4 pb-5 pt-1 border-t border-accent/10">
          <button
            onClick={() => goTo(page - 1)}
            disabled={page <= 1}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs text-text-muted hover:text-accent hover:bg-accent/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={15} />
            Oldingi
          </button>

          <span className="text-accent/60 text-xs font-medium tabular-nums">
            {page} / {TOTAL_PAGES}
          </span>

          <button
            onClick={() => goTo(page + 1)}
            disabled={page >= TOTAL_PAGES}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs text-text-muted hover:text-accent hover:bg-accent/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Keyingi
            <ChevronLeft size={15} />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
