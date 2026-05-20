import { cn } from '@/components/ui/cn'
import { useQuranStore } from '@/stores/quranStore'
import { ARABIC_FONT_SIZE_CLASSES } from '@/constants/quran'

interface ArabicTextProps {
  text: string
  className?: string
  isActive?: boolean
  isSajda?: boolean
}

const TAJWEED_RULES: [RegExp, string][] = [
  [/([اوي])\s/g, '<span class="text-emerald-400">$1</span> '],
  [/(ٱللَّه|الله)/g, '<span class="text-amber-400">$1</span>'],
]

export function ArabicText({ text, className, isActive, isSajda }: ArabicTextProps) {
  const { fontSize, tajweedMode } = useQuranStore()

  const sizeClass = ARABIC_FONT_SIZE_CLASSES[fontSize] || ARABIC_FONT_SIZE_CLASSES[20]

  const displayText = tajweedMode
    ? text
    : text

  return (
    <p
      className={cn(
        'arabic-text font-arabic select-text',
        sizeClass,
        isActive && 'text-accent',
        isSajda && 'after:content-["۩"] after:text-accent after:ml-2',
        className
      )}
      dir="rtl"
      lang="ar"
      dangerouslySetInnerHTML={tajweedMode ? { __html: displayText } : undefined}
    >
      {!tajweedMode ? displayText : undefined}
    </p>
  )
}
