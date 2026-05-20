import { useEffect, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from './cn'

interface DrawerProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  side?: 'bottom' | 'right' | 'left'
  className?: string
}

const slideVariants = {
  bottom: {
    initial: { y: '100%' },
    animate: { y: 0 },
    exit: { y: '100%' },
  },
  right: {
    initial: { x: '100%' },
    animate: { x: 0 },
    exit: { x: '100%' },
  },
  left: {
    initial: { x: '-100%' },
    animate: { x: 0 },
    exit: { x: '-100%' },
  },
}

const sideClasses = {
  bottom: 'bottom-0 left-0 right-0 rounded-t-2xl max-h-[85dvh]',
  right: 'right-0 top-0 bottom-0 w-full max-w-sm rounded-l-2xl',
  left: 'left-0 top-0 bottom-0 w-full max-w-sm rounded-r-2xl',
}

export function Drawer({ open, onClose, title, children, side = 'bottom', className }: DrawerProps) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const variants = slideVariants[side]

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={variants.initial}
            animate={variants.animate}
            exit={variants.exit}
            transition={{ type: 'spring', damping: 30, stiffness: 350 }}
            className={cn(
              'absolute bg-bg-secondary border border-border-subtle overflow-hidden',
              sideClasses[side],
              className
            )}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-border-subtle">
              <div className="w-12 h-1 bg-border-subtle rounded-full mx-auto" />
              {title && <h3 className="text-base font-semibold text-text-primary">{title}</h3>}
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors"
                aria-label="Close drawer"
              >
                <X size={16} />
              </button>
            </div>
            <div className="overflow-y-auto no-scrollbar h-full pb-safe-bottom">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
