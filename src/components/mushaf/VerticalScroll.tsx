import { cn } from '@/components/ui/cn'
import { useAudioStore } from '@/stores/audioStore'
import { useQuranStore } from '@/stores/quranStore'
import type { Verse, Surah } from '@/types/quran'

const AR = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩']
const toAr = (n: number) => String(n).split('').map(d => AR[+d]).join('')

interface Props {
  verses: Verse[]
  surah?: Surah | null
  fontSize: number
  isFullscreen?: boolean
}

function SurahOrnament({ surah }: { surah: Surah }) {
  return (
    <div className="flex flex-col items-center my-6 gap-3">
      <div className="flex items-center gap-3 w-full max-w-xs">
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, #C9A84C60)' }} />
        <span style={{ color: '#C9A84C60' }} className="text-xs select-none">❖</span>
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, #C9A84C60)' }} />
      </div>
      <div className="relative w-full max-w-[260px]">
        <div
          className="rounded-xl overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #C9A84C 0%, #A67C30 50%, #C9A84C 100%)', padding: '2px' }}
        >
          <div
            className="rounded-lg flex flex-col items-center py-3 px-8"
            style={{ background: 'linear-gradient(135deg, #1a0e04 0%, #110b03 100%)' }}
          >
            <p
              className="font-arabic text-center leading-snug font-bold"
              style={{ fontSize: 18, color: '#C9A84C' }}
              dir="rtl"
            >
              سُورَةُ {surah.name_arabic}
            </p>
            <p style={{ fontSize: 10, color: '#C9A84C', opacity: 0.7 }} className="mt-1">
              {surah.name_transliteration} • {surah.total_verses} آية
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3 w-full max-w-xs">
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, #C9A84C60)' }} />
        <span style={{ color: '#C9A84C60' }} className="text-xs select-none">❖</span>
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, #C9A84C60)' }} />
      </div>
    </div>
  )
}

export function VerticalScroll({ verses, surah, fontSize, isFullscreen = false }: Props) {
  const { reciterIdentifier } = useQuranStore()
  const { play, currentVerse, currentSurah } = useAudioStore()
  const activeSurah = surah?.number ?? 1

  const height = isFullscreen ? '100dvh' : 'calc(100dvh - 7.5rem)'

  if (verses.length === 0) {
    return (
      <div
        className="flex items-center justify-center"
        style={{ height, background: '#0f0a05' }}
      >
        <p style={{ color: '#C9A84C60', fontSize: 14 }}>Yuklanmoqda...</p>
      </div>
    )
  }

  return (
    <div
      className="overflow-y-auto"
      style={{ height, background: 'linear-gradient(180deg, #0f0a05 0%, #1a120a 100%)' }}
    >
      <div className="px-5 pt-2 pb-16">
        {surah && <SurahOrnament surah={surah} />}

        {surah && surah.number !== 1 && surah.number !== 9 && (
          <div className="flex justify-center mb-5">
            <p
              className="font-arabic text-center leading-loose"
              style={{ fontSize: fontSize + 2, color: '#E8D5A0' }}
              dir="rtl"
            >
              بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
            </p>
          </div>
        )}

        <p
          className="font-arabic text-right"
          style={{ fontSize, lineHeight: '3.2', color: '#F5EDD0', direction: 'rtl' }}
          dir="rtl"
        >
          {verses.map((verse) => {
            const isActive = currentSurah === activeSurah && currentVerse === verse.number
            return (
              <span
                key={verse.id}
                className={cn(
                  'cursor-pointer transition-colors duration-200 rounded-sm',
                  isActive ? 'text-amber-300' : 'hover:text-amber-200/60'
                )}
                onClick={() => {
                  const url = `https://cdn.islamic.network/quran/audio/128/${reciterIdentifier}/${String(activeSurah).padStart(3, '0')}${String(verse.number).padStart(3, '0')}.mp3`
                  play(activeSurah, verse.number, url)
                }}
              >
                {verse.text_arabic}
                {' '}
                <span
                  style={{ fontSize: fontSize * 0.58, color: '#C9A84C', fontFamily: 'serif' }}
                  className="select-none"
                >
                  ﴿{toAr(verse.number)}﴾
                </span>
                {' '}
              </span>
            )
          })}
        </p>
      </div>
    </div>
  )
}
