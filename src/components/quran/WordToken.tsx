import { cn } from '@/components/ui/cn'
import { useRecitationStore } from '@/stores/recitationStore'
import type { WordStatus } from '@/stores/recitationStore'

interface WordTokenProps {
  word: string
  status: WordStatus
}

export function WordToken({ word, status }: WordTokenProps) {
  const { displayMode } = useRecitationStore()
  const isReveal = displayMode === 'reveal'

  return (
    <span
      className={cn(
        'inline transition-all duration-300 select-none',
        // highlight mode
        !isReveal && status === 'dim'     && 'opacity-20 text-text-arabic',
        !isReveal && status === 'current' && 'opacity-100 text-accent underline underline-offset-4 decoration-accent/50',
        !isReveal && status === 'correct' && 'opacity-100 text-text-arabic',
        !isReveal && status === 'wrong'   && 'opacity-100 text-error-red',
        // reveal mode — text stays invisible until correctly recited
        isReveal && status === 'dim'     && 'text-transparent',
        isReveal && status === 'current' && 'text-transparent underline underline-offset-4 decoration-accent decoration-2',
        isReveal && status === 'correct' && 'opacity-100 text-text-arabic',
        isReveal && status === 'wrong'   && 'text-transparent underline underline-offset-4 decoration-error-red decoration-2',
      )}
    >
      {word}
    </span>
  )
}
