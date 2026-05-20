import { AnimatePresence, motion } from 'framer-motion'
import { X, BookOpen, ChevronDown } from 'lucide-react'
import { useQuranStore } from '@/stores/quranStore'
import { useTafsir } from '@/api/quran'
import { Spinner } from '@/components/ui/Spinner'
import { cn } from '@/components/ui/cn'

export function TafsirPanel() {
  const { activeTafsirVerse, closeTafsir, language } = useQuranStore()

  const { data, isLoading, error } = useTafsir(
    activeTafsirVerse?.surah ?? 0,
    activeTafsirVerse?.verse ?? 0,
    language
  )

  return (
    <AnimatePresence>
      {activeTafsirVerse && (
        <>
          <motion.div
            key="tafsir-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50"
            onClick={closeTafsir}
          />

          <motion.div
            key="tafsir-panel"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 35 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-bg-card border-t border-border rounded-t-2xl safe-bottom"
            style={{ maxHeight: '80vh' }}
          >
            <div className="flex flex-col h-full" style={{ maxHeight: '80vh' }}>
              <div className="flex items-center justify-between px-5 py-4 border-b border-border-subtle">
                <div className="flex items-center gap-2">
                  <BookOpen size={16} className="text-accent" />
                  <span className="font-medium text-text-primary text-sm">Tafsir</span>
                  {activeTafsirVerse && (
                    <span className="text-text-muted text-sm">
                      {activeTafsirVerse.surah}:{activeTafsirVerse.verse}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={closeTafsir}
                    className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-elevated transition-colors"
                  >
                    <ChevronDown size={18} />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-4">
                {isLoading && (
                  <div className="flex justify-center py-12">
                    <Spinner />
                  </div>
                )}

                {error && (
                  <div className="text-center py-12">
                    <p className="text-text-muted text-sm">
                      {language === 'uz_latin' || language === 'uz_cyrillic'
                        ? "O'zbek tafsiri hozircha mavjud emas"
                        : 'Tafsir not available'}
                    </p>
                  </div>
                )}

                {data && (
                  <div className="space-y-4">
                    <div className="bg-bg-elevated rounded-xl p-4 border border-border-subtle">
                      <p
                        className="font-arabic text-text-arabic text-2xl leading-loose text-right"
                        dir="rtl"
                        lang="ar"
                      >
                        {data.text_arabic}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-text-muted uppercase tracking-wider">
                        {data.source}
                      </span>
                      <span className="text-xs text-text-muted">
                        {data.surah_name} • {data.surah_number}:{data.verse_number}
                      </span>
                    </div>

                    <p className="text-text-secondary text-sm leading-relaxed">
                      {data.content}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
