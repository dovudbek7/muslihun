import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search as SearchIcon, X, ArrowLeft } from 'lucide-react'
import { useSearch } from '@/api/search'
import { useQuranStore } from '@/stores/quranStore'
import { useDebounce } from '@/hooks/useDebounce'
import { buildRoute } from '@/constants/routes'
import { cn } from '@/components/ui/cn'
import type { SearchResult } from '@/types/api'

export function Search() {
  const navigate = useNavigate()
  const { language, navigateTo } = useQuranStore()
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const debouncedQuery = useDebounce(query, 400)

  const { data, isFetching } = useSearch(debouncedQuery, language)

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100)
  }, [])

  function handleSelect(result: SearchResult) {
    navigateTo(result.surah_number, result.ayah ?? 1, result.page ?? undefined)
    navigate(buildRoute.surah(result.surah_number))
  }

  return (
    <div className="flex flex-col min-h-full safe-top">
      <div className="sticky top-0 z-10 bg-bg-primary/95 backdrop-blur-md border-b border-border-subtle">
        <div className="flex items-center gap-2 px-4 py-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-elevated transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex-1 flex items-center gap-2 bg-bg-elevated rounded-xl px-3 py-2.5">
            <SearchIcon size={15} className="text-text-muted flex-shrink-0" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Sura nomi, oyat, tarjima..."
              className="flex-1 bg-transparent text-text-primary placeholder-text-muted outline-none text-sm"
              autoComplete="off"
              spellCheck={false}
            />
            {query && (
              <button onClick={() => setQuery('')} className="text-text-muted">
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1">
        {!query && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <SearchIcon size={40} className="text-text-muted/30" />
            <p className="text-text-muted text-sm">Arabic, uzbekcha, inglizcha yozing</p>
          </div>
        )}

        {isFetching && query && (
          <div className="flex justify-center py-10">
            <span className="w-5 h-5 border-2 border-border border-t-accent rounded-full animate-spin" />
          </div>
        )}

        {!isFetching && data?.results.length === 0 && query && (
          <div className="flex flex-col items-center justify-center py-20 gap-2">
            <p className="text-text-muted text-sm">Natija topilmadi</p>
            <p className="text-text-muted/50 text-xs">"{debouncedQuery}"</p>
          </div>
        )}

        {data?.results.map((result, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            onClick={() => handleSelect(result)}
            className="w-full flex items-start gap-3 px-4 py-4 hover:bg-bg-elevated transition-colors border-b border-border-subtle last:border-0 text-left"
          >
            <div className="w-8 h-8 rounded-lg bg-bg-elevated flex items-center justify-center text-xs font-medium text-text-muted flex-shrink-0 mt-0.5">
              {result.surah_number}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-sm font-medium text-text-primary">{result.surah_name}</span>
                {result.ayah && (
                  <span className="text-xs text-text-muted">{result.surah_number}:{result.ayah}</span>
                )}
              </div>
              {result.text_arabic && (
                <p className="text-base font-arabic text-text-arabic leading-relaxed text-right mb-1" dir="rtl">
                  {result.text_arabic}
                </p>
              )}
              <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
                {result.matched_text}
              </p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
