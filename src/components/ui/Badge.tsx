import { cn } from './cn'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'accent' | 'success' | 'error' | 'warning' | 'muted'
  size?: 'sm' | 'md'
  className?: string
}

const variants = {
  default: 'bg-bg-elevated text-text-secondary border border-border-subtle',
  accent: 'bg-accent/15 text-accent border border-accent/20',
  success: 'bg-success/10 text-success border border-success/20',
  error: 'bg-error-red/10 text-error-red border border-error-red/20',
  warning: 'bg-error-yellow/10 text-error-yellow border border-error-yellow/20',
  muted: 'bg-bg-hover text-text-muted',
}

const sizes = {
  sm: 'text-xs px-2 py-0.5 rounded-md',
  md: 'text-sm px-2.5 py-1 rounded-lg',
}

export function Badge({ children, variant = 'default', size = 'sm', className }: BadgeProps) {
  return (
    <span className={cn('inline-flex items-center font-medium', variants[variant], sizes[size], className)}>
      {children}
    </span>
  )
}
