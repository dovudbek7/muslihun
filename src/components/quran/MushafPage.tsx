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
  onVerseClick?: (verse: Verse) => void
}

const BORDER_RADIUS = {
  right: 'rounded-r-2xl',
  left: 'rounded-l-2xl',
  single: 'rounded-2xl',
} as const

function OrnamentLine() {
  return (
    <svg width="100%" height="6" viewBox="0 0 200 6" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 3 Q25 0 50 3 Q75 6 100 3 Q125 0 150 3 Q175 6 200 3" fill="none" stroke="var(--mushaf-accent,#8B6520)" strokeWidth="0.8" opacity="0.6"/>
    </svg>
  )
}

function SurahBanner({ surah }: { surah: Surah }) {
  return (
    <div className="flex justify-center px-3 pt-1 pb-2 flex-shrink-0">
      <div className="relative w-full max-w-[280px]">
        {/* Outer decorative border */}
        <div
          className="relative rounded-lg overflow-hidden"
          style={{
            background: 'var(--mushaf-header-bg, linear-gradient(135deg, #C9A84C 0%, #A67C30 50%, #C9A84C 100%))',
            padding: '2px',
          }}
        >
          {/* Diamond ornaments on outer border */}
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[#F5EDD0] text-[8px] opacity-80 select-none">◆❖◆</span>
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[#F5EDD0] text-[8px] opacity-80 select-none">◆❖◆</span>

          {/* Inner content */}
          <div
            className="relative rounded-md flex flex-col items-center py-2 px-8"
            style={{ background: 'linear-gradient(135deg, #F5EDD0 0%, #EDE0C4 100%)' }}
          >
            <p
              className="font-arabic text-center leading-snug font-bold"
              style={{ fontSize: 16, color: 'var(--mushaf-accent, #8B6520)' }}
              dir="rtl"
            >
              سُورَةُ {surah.name_arabic}
            </p>
            <p style={{ fontSize: 9, color: 'var(--mushaf-accent,#8B6520)', opacity: 0.7 }} className="mt-0.5">
              {surah.name_transliteration} • {surah.total_verses} آية
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function MushafPage({ verses, fontSize, pageNumber, side = 'single', allSurahs, onVerseClick }: Props) {
  const startingSurahs = useMemo(
    () => allSurahs?.filter(s => s.page_start === pageNumber) ?? [],
    [allSurahs, pageNumber]
  )
  const juzNumber = verses[0]?.juz_number
  const br = BORDER_RADIUS[side]

  return (
    <div
      className={cn('relative flex flex-col h-full overflow-hidden', br)}
      style={{
        background: 'var(--mushaf-bg, linear-gradient(160deg, #F5EDD0 0%, #EDE0C4 50%, #F0E8C8 100%))',
        boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
      }}
    >
      {/* Outer double border frame */}
      <div
        className={cn('absolute inset-0 pointer-events-none z-10', br)}
        style={{ border: '2px solid var(--mushaf-border, rgba(139,90,20,0.45))' }}
      />
      <div
        className={cn('absolute inset-[5px] pointer-events-none z-10', br)}
        style={{ border: '1px solid var(--mushaf-border, rgba(139,90,20,0.45))', opacity: 0.5 }}
      />

      {/* Corner ornaments */}
      <span className="absolute top-1.5 left-1.5 z-20 text-[10px] leading-none select-none" style={{ color: 'var(--mushaf-accent,#8B6520)', opacity: 0.7 }}>✦</span>
      <span className="absolute top-1.5 right-1.5 z-20 text-[10px] leading-none select-none" style={{ color: 'var(--mushaf-accent,#8B6520)', opacity: 0.7 }}>✦</span>
      <span className="absolute bottom-1.5 left-1.5 z-20 text-[10px] leading-none select-none" style={{ color: 'var(--mushaf-accent,#8B6520)', opacity: 0.7 }}>✦</span>
      <span className="absolute bottom-1.5 right-1.5 z-20 text-[10px] leading-none select-none" style={{ color: 'var(--mushaf-accent,#8B6520)', opacity: 0.7 }}>✦</span>

      {/* Top bar: surah (right) — juz (left), RTL */}
      <div className="relative flex justify-between items-center px-6 pt-4 pb-1 flex-shrink-0" dir="rtl">
        <span className="font-arabic" style={{ fontSize: 9, color: 'var(--mushaf-accent,#8B6520)', opacity: 0.75 }}>
          {startingSurahs[0]?.name_arabic
            ? `سُورَةُ ${startingSurahs[0].name_arabic}`
            : verses[0]?.surah_number
              ? ''
              : ''}
        </span>
        <span className="font-arabic" style={{ fontSize: 9, color: 'var(--mushaf-accent,#8B6520)', opacity: 0.75 }}>
          {juzNumber ? `الجُزْءُ ${toAr(juzNumber)}` : ''}
        </span>
      </div>

      {/* Top ornament line */}
      <div className="px-5 pb-1 flex-shrink-0 opacity-60">
        <OrnamentLine />
      </div>

      {/* Surah banner(s) */}
      {startingSurahs.map(surah => (
        <SurahBanner key={surah.number} surah={surah} />
      ))}

      {/* Bismillah */}
      {startingSurahs.some(s => s.number !== 1 && s.number !== 9) && (
        <div className="flex justify-center px-4 pb-2 flex-shrink-0">
          <p
            className="font-arabic text-center leading-loose"
            style={{
              fontSize: fontSize + 1,
              color: 'var(--mushaf-text, #2C1A0A)',
              letterSpacing: '0.02em',
            }}
            dir="rtl"
          >
            بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
          </p>
        </div>
      )}

      {/* Arabic verse text — continuous flow */}
      <div className="flex-1 px-5 pb-1 overflow-hidden">
        <p
          className="font-arabic text-right leading-loose"
          style={{
            fontSize,
            lineHeight: '2.55',
            color: 'var(--mushaf-text, #2C1A0A)',
          }}
          dir="rtl"
        >
          {verses.map(verse => (
            <span
              key={verse.id}
              className="cursor-pointer transition-colors"
              style={{ borderRadius: 3 }}
              onClick={() => onVerseClick?.(verse)}
            >
              {verse.text_arabic}
              {' '}
              <span
                className="inline-flex items-center justify-center"
                style={{
                  fontSize: fontSize * 0.62,
                  color: 'var(--mushaf-accent, #8B6520)',
                  fontFamily: 'serif',
                }}
              >
                ۞{toAr(verse.number)}
              </span>
              {' '}
            </span>
          ))}
        </p>
      </div>

      {/* Bottom ornament line */}
      <div className="px-5 pt-1 flex-shrink-0 opacity-60">
        <OrnamentLine />
      </div>

      {/* Page number */}
      <div className="flex justify-center pb-3 pt-1 flex-shrink-0">
        <span
          className="font-arabic"
          style={{ fontSize: 11, color: 'var(--mushaf-accent, #8B6520)', opacity: 0.75 }}
        >
          {toAr(pageNumber)}
        </span>
      </div>
    </div>
  )
}
