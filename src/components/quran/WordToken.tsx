import { cn } from '@/components/ui/cn'
import type { WordStatus } from '@/stores/recitationStore'

interface WordTokenProps {
  word: string
  status: WordStatus
}

export function WordToken({ word, status }: WordTokenProps) {
  return (
    <span
      className={cn(
        'inline transition-all duration-300 select-none',
        status === 'dim'     && 'opacity-20 text-text-arabic',
        status === 'current' && 'opacity-100 text-accent',
        status === 'correct' && 'opacity-100 text-text-arabic',
        status === 'wrong'   && 'opacity-100 text-error-red',
      )}
    >
      {word}
    </span>
  )
}
