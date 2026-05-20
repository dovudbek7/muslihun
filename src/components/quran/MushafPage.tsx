import { useMemo } from 'react'
import { cn } from '@/components/ui/cn'
import type { Verse, Surah } from '@/types/quran'

const AR = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩']
const toAr = (n: number) => String(n).split('').map(d => AR[+d]).join('')

interface Props {
  verses: Verse[]
  fontSize: number
  pageNumber: number
  side?: 'right' | 'left' | 'single'
  allSurahs?: Surah[]
}

const CORNER_POS = {
  tl: 'top-1 left-1',
  tr: 'top-1 right-1',
  bl: 'bottom-1 left-1 rotate-90',
  br: 'bottom-1 right-1 -rotate-90',
} as const

const BORDER_RADIUS = {
  right: 'rounded-r-xl',
  left: 'rounded-l-xl',
  single: 'rounded-xl',
} as const

export function MushafPage({ verses, fontSize, pageNumber, side = 'single', allSurahs }: Props) {
  const startingSurahs = useMemo(
    () => allSurahs?.filter(s => s.page_start === pageNumber) ?? [],
    [allSurahs, pageNumber]
  )
  const juzNumber = verses[0]?.juz_number
  const br = BORDER_RADIUS[side]

  return (
    <div
      className={cn('relative flex flex-col h-full overflow-hidden', br)}
      style={{ background: 'var(--mushaf-bg, linear-gradient(135deg, #1a1208 0%, #120F0E 50%, #1a1208 100%))' }}
    >
      {/* Outer border */}
      <div
        className={cn('absolute inset-0 pointer-events-none z-10', br)}
        style={{ border: '2.5px solid rgba(45,106,79,0.65)', boxShadow: 'inset 0 0 0 1px rgba(45,106,79,0.15)' }}
      />
      {/* Inner border */}
      <div
        className={cn('absolute inset-[7px] pointer-events-none z-10', br)}
        style={{ border: '1px solid rgba(45,106,79,0.3)' }}
      />

      {/* Corner ornaments */}
      {Object.entries(CORNER_POS).map(([key, pos]) => (
        <span key={key} className={cn('absolute z-20 text-emerald-600/50 text-[10px] leading-none select-none', pos)}>
          ✿
        </span>
      ))}

      {/* Top bar: surah right, juz left (RTL) */}
      <div className="relative flex justify-between items-center px-5 pt-3 pb-1 flex-shrink-0" dir="rtl">
        {startingSurahs[0] ? (
          <span className="text-[10px] text-emerald-700/70 dark:text-emerald-400/60 font-arabic">
            سُورَةُ {startingSurahs[0].name_arabic}
          </span>
        ) : <span />}
        <span className="text-[10px] text-emerald-700/70 dark:text-emerald-400/60 font-arabic">
          {juzNumber ? `الجزء ${toAr(juzNumber)}` : ''}
        </span>
      </div>

      {/* Surah name box(es) */}
      {startingSurahs.map(surah => (
        <div key={surah.number} className="flex justify-center px-4 pt-1 pb-2 flex-shrink-0">
          <div
            className="relative px-6 py-1.5 text-center"
            style={{
              background: 'linear-gradient(135deg, rgba(45,106,79,0.12), rgba(45,106,79,0.04))',
              border: '1px solid rgba(45,106,79,0.38)',
              borderRadius: 8,
            }}
          >
            <span className="absolute top-0.5 left-2 text-emerald-600/40 text-xs select-none">❧</span>
            <span className="absolute top-0.5 right-2 text-emerald-600/40 text-xs select-none">❧</span>
            <p className="font-arabic text-emerald-800 dark:text-emerald-300 text-lg leading-snug">
              {surah.name_arabic}
            </p>
            <p className="text-emerald-700/55 dark:text-emerald-400/55 text-[10px] mt-0.5">
              {surah.name_transliteration} • {surah.total_verses} آية
            </p>
          </div>
        </div>
      ))}

      {/* Bismillah */}
      {startingSurahs.some(s => s.number !== 1 && s.number !== 9) && (
        <div className="flex justify-center px-4 pb-1 flex-shrink-0">
          <p
            className="font-arabic text-center leading-loose"
            style={{ fontSize: fontSize + 1, color: 'var(--mushaf-text, var(--text-arabic))' }}
            dir="rtl"
          >
            بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
          </p>
        </div>
      )}

      {/* Arabic text */}
      <div className="flex-1 px-4 pb-1 overflow-hidden">
        <p
          className="font-arabic text-right"
          style={{ fontSize, lineHeight: '2.6', color: 'var(--mushaf-text, var(--text-arabic))' }}
          dir="rtl"
        >
          {verses.map(verse => (
            <span key={verse.id}>
              {verse.text_arabic}
              {' '}
              <span
                className="inline-flex items-center justify-center text-emerald-700/80 dark:text-emerald-500/70 mx-0.5"
                style={{ fontSize: fontSize * 0.65 }}
              >
                ﴿{toAr(verse.number)}﴾
              </span>
              {' '}
            </span>
          ))}
        </p>
      </div>

      {/* Page number */}
      <div className="flex justify-center pt-1 pb-2.5 flex-shrink-0 border-t border-emerald-800/10">
        <span className="font-arabic text-sm text-emerald-700/55 dark:text-emerald-500/55">
          {toAr(pageNumber)}
        </span>
      </div>
    </div>
  )
}
