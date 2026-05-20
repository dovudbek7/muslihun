import { useQuery } from '@tanstack/react-query'
import { api } from '@/config/api'
import type { SearchResponse } from '@/types/api'
import type { Language } from '@/types/quran'

export const searchKeys = {
  results: (q: string, lang: Language) => ['search', q, lang] as const,
}

export function useSearch(query: string, lang: Language = 'en', limit = 20) {
  return useQuery<SearchResponse>({
    queryKey: searchKeys.results(query, lang),
    queryFn: () =>
      api.get('/search/', { params: { q: query, lang, limit } }).then(r => r.data),
    enabled: query.trim().length >= 1,
    staleTime: 1000 * 60 * 5,
    placeholderData: (prev) => prev,
  })
}
