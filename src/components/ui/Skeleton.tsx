import { cn } from './cn'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={cn('animate-pulse rounded-lg bg-bg-elevated', className)} />
  )
}

export function VerseCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border-subtle bg-bg-card px-5 py-5 space-y-3">
      <div className="flex items-start gap-4">
        <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-6 w-3/4 ml-auto" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
    </div>
  )
}
