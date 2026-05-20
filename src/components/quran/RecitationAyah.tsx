import { useEffect, useRef } from 'react'
import { useRecitationStore } from '@/stores/recitationStore'
import { useQuranStore } from '@/stores/quranStore'
import { ARABIC_FONT_SIZE_CLASSES } from '@/constants/quran'
import { WordToken } from './WordToken'

interface RecitationAyahProps {
  arabicText: string
  verseNumber: number
}

export function RecitationAyah({ arabicText, verseNumber }: RecitationAyahProps) {
  const { words, currentIndex, sessionStatus } = useRecitationStore()
  const { fontSize } = useQuranStore()
  const currentRef = useRef<HTMLSpanElement>(null)
  const sizeClass = ARABIC_FONT_SIZE_CLASSES[fontSize] ?? ARABIC_FONT_SIZE_CLASSES[20]

  useEffect(() => {
    currentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [currentIndex])

  if (sessionStatus === 'idle') {
    return (
      <p
        dir="rtl"
        lang="ar"
        className={`arabic-text font-arabic text-right text-text-arabic opacity-25 ${sizeClass}`}
      >
        {arabicText}{' '}
        <span className="text-text-muted opacity-60">﴿{verseNumber}﴾</span>
      </p>
    )
  }

  return (
    <p
      dir="rtl"
      lang="ar"
      className={`arabic-text font-arabic text-right ${sizeClass}`}
    >
      {words.map((word, i) => (
        <span key={i} ref={i === currentIndex ? currentRef : undefined}>
          <WordToken word={word.text} status={word.status} />
          {i < words.length - 1 && ' '}
        </span>
      ))}
      {' '}
      <span className="text-text-muted opacity-60">﴿{verseNumber}﴾</span>
    </p>
  )
}
