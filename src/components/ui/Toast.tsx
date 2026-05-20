import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle, XCircle, Info, X } from 'lucide-react'
import { useUIStore } from '@/stores/uiStore'
import { cn } from '@/components/ui/cn'

const ICONS = {
  success: <CheckCircle size={16} className="text-emerald-400" />,
  error: <XCircle size={16} className="text-red-400" />,
  info: <Info size={16} className="text-accent" />,
}

const COLORS = {
  success: 'border-emerald-400/30 bg-emerald-400/10',
  error: 'border-red-400/30 bg-red-400/10',
  info: 'border-accent/30 bg-accent/10',
}

export function Toast() {
  const { notification, clearNotification } = useUIStore()

  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          key="toast"
          initial={{ opacity: 0, y: 80, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 80, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className={cn(
            'fixed bottom-24 left-1/2 -translate-x-1/2 z-50',
            'flex items-center gap-2.5 px-4 py-3 rounded-xl',
            'border shadow-lg backdrop-blur-sm',
            'max-w-xs w-[calc(100vw-2rem)]',
            COLORS[notification.type]
          )}
        >
          {ICONS[notification.type]}
          <span className="flex-1 text-sm text-text-primary leading-tight">
            {notification.message}
          </span>
          <button
            onClick={clearNotification}
            className="text-text-muted hover:text-text-primary transition-colors flex-shrink-0"
          >
            <X size={14} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
