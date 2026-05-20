import { useState, useRef, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, X, BookOpen, ChevronRight } from 'lucide-react'
import { useUIStore } from '@/stores/uiStore'
import { useQuranStore } from '@/stores/quranStore'
import { useSearch } from '@/api/search'
import { useDebounce } from '@/hooks/useDebounce'
import { cn } from '@/components/ui/cn'
import type { SearchResult } from '@/types/api'

export function SearchOverlay() {
  const { isSearchOpen, closeSearch } = useUIStore()
  const { language, navigateTo } = useQuranStore()
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const debouncedQuery = useDebounce(query, 400)

  const { data, isFetching } = useSearch(debouncedQuery, language)

  useEffect(() => {
    if (isSearchOpen) {
      setQuery('')
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isSearchOpen])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSearch()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [closeSearch])

  function handleSelect(result: SearchResult) {
    navigateTo(result.surah_number, result.ayah ?? 1, result.page ?? undefined)
    closeSearch()
  }

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 bg-bg-primary/95 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) closeSearch() }}
        >
          <div className="flex flex-col h-full safe-top safe-bottom">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border-subtle">
              <Search size={18} className="text-text-muted flex-shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Qidirish: sura nomi, oyat, tarjima..."
                className="flex-1 bg-transparent text-text-primary placeholder-text-muted outline-none text-base"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="text-text-muted hover:text-text-primary transition-colors"
                >
                  <X size={16} />
                </button>
              )}
              <button
                onClick={closeSearch}
                className="text-text-secondary hover:text-text-primary transition-colors text-sm font-medium"
              >
                Yopish
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {!query && (
                <div className="flex flex-col items-center justify-center h-48 gap-3">
                  <Search size={32} className="text-text-muted/40" />
                  <p className="text-text-muted text-sm">Arabic, uzbekcha, inglizcha...</p>
                </div>
              )}

              {isFetching && query && (
                <div className="flex items-center justify-center py-8">
                  <span className="w-5 h-5 border-2 border-border border-t-accent rounded-full animate-spin" />
                </div>
              )}

              {!isFetching && data?.results.length === 0 && query && (
                <div className="flex flex-col items-center justify-center h-48 gap-2">
                  <p className="text-text-muted text-sm">Natija topilmadi</p>
                  <p className="text-text-muted/60 text-xs">"{debouncedQuery}"</p>
                </div>
              )}

              {data?.results.map((result, i) => (
                <SearchResultItem key={i} result={result} onSelect={handleSelect} />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function SearchResultItem({
  result,
  onSelect,
}: {
  result: SearchResult
  onSelect: (r: SearchResult) => void
}) {
  return (
    <motion.button
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      onClick={() => onSelect(result)}
      className="w-full flex items-start gap-3 px-4 py-3.5 hover:bg-bg-elevated transition-colors border-b border-border-subtle last:border-0 text-left"
    >
      <div className="mt-0.5 w-7 h-7 rounded-lg bg-bg-elevated flex items-center justify-center flex-shrink-0">
        <BookOpen size={13} className="text-accent" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-sm font-medium text-text-primary">
            {result.surah_name}
          </span>
          {result.ayah && (
            <span className="text-xs text-text-muted">
              {result.surah_number}:{result.ayah}
            </span>
          )}
          {result.page && (
            <span className="text-xs text-text-muted/60">
              {result.page}-sahifa
            </span>
          )}
        </div>

        {result.text_arabic && (
          <p
            className="text-sm text-text-arabic font-arabic leading-relaxed text-right mb-1"
            dir="rtl"
          >
            {result.text_arabic}
          </p>
        )}

        <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
          {result.matched_text}
        </p>
      </div>

      <ChevronRight size={14} className="text-text-muted flex-shrink-0 mt-1" />
    </motion.button>
  )
}
