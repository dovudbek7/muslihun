import { useRef, useEffect } from 'react'
import { useQuranStore } from '@/stores/quranStore'
import { ARABIC_FONT_SIZE_CLASSES } from '@/constants/quran'
import { RecitationAyah } from './RecitationAyah'
import type { Verse } from '@/types/quran'

type VerseState = 'completed' | 'active' | 'upcoming'

interface ContinuousVerseProps {
  verse: Verse
  state: VerseState
  isScrollTarget?: boolean
}

export function ContinuousVerse({ verse, state, isScrollTarget }: ContinuousVerseProps) {
  const { fontSize } = useQuranStore()
  const ref = useRef<HTMLDivElement>(null)
  const sizeClass = ARABIC_FONT_SIZE_CLASSES[fontSize] ?? ARABIC_FONT_SIZE_CLASSES[20]

  useEffect(() => {
    if (isScrollTarget) {
      ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [isScrollTarget])

  if (state === 'active') {
    return (
      <div ref={ref} className="py-4 px-1 border-b border-border-subtle">
        <RecitationAyah arabicText={verse.text_arabic} verseNumber={verse.number} />
      </div>
    )
  }

  return (
    <div
      ref={ref}
      className={`py-4 px-1 border-b border-border-subtle transition-opacity duration-500 ${
        state === 'completed' ? 'opacity-100' : 'opacity-20'
      }`}
    >
      <p
        dir="rtl"
        lang="ar"
        className={`arabic-text font-arabic text-right text-text-arabic ${sizeClass}`}
      >
        {verse.text_arabic}{' '}
        <span className="text-text-muted opacity-60">﴿{verse.number}﴾</span>
      </p>
    </div>
  )
}
