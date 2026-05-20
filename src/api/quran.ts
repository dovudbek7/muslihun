import { useQuery } from '@tanstack/react-query'
import { api } from '@/config/api'
import type { Surah, Verse, PageData, JuzData, NavigationData, TafsirDetail, Language } from '@/types/quran'

const STALE_TIME = 1000 * 60 * 60 * 24

export const quranKeys = {
  all: ['quran'] as const,
  surahs: (lang: Language) => ['quran', 'surahs', lang] as const,
  surah: (n: number, lang: Language) => ['quran', 'surah', n, lang] as const,
  verse: (s: number, v: number, lang: Language) => ['quran', 'verse', s, v, lang] as const,
  page: (n: number, lang: Language) => ['quran', 'page', n, lang] as const,
  juz: (n: number, lang: Language) => ['quran', 'juz', n, lang] as const,
  tafsir: (s: number, v: number, lang: Language) => ['quran', 'tafsir', s, v, lang] as const,
  navigation: ['quran', 'navigation'] as const,
}

export function useSurahs(lang: Language = 'en') {
  return useQuery<Surah[]>({
    queryKey: quranKeys.surahs(lang),
    queryFn: () => api.get('/quran/surahs/', { params: { lang } }).then(r => r.data),
    staleTime: STALE_TIME,
    gcTime: STALE_TIME * 7,
  })
}

export function useSurah(surahNumber: number, lang: Language = 'en') {
  return useQuery<Surah>({
    queryKey: quranKeys.surah(surahNumber, lang),
    queryFn: () => api.get(`/quran/surahs/${surahNumber}/`, { params: { lang } }).then(r => r.data),
    enabled: surahNumber >= 1 && surahNumber <= 114,
    staleTime: STALE_TIME,
  })
}

export function useVerse(surahNumber: number, verseNumber: number, lang: Language = 'en') {
  return useQuery<Verse>({
    queryKey: quranKeys.verse(surahNumber, verseNumber, lang),
    queryFn: () =>
      api.get(`/quran/surahs/${surahNumber}/verses/${verseNumber}/`, { params: { lang } }).then(r => r.data),
    enabled: surahNumber >= 1 && verseNumber >= 1,
    staleTime: STALE_TIME,
  })
}

export function usePage(pageNumber: number, lang: Language = 'en') {
  return useQuery<PageData>({
    queryKey: quranKeys.page(pageNumber, lang),
    queryFn: () =>
      api.get(`/quran/pages/${pageNumber}/`, { params: { lang } }).then(r => r.data),
    enabled: pageNumber >= 1 && pageNumber <= 604,
    staleTime: STALE_TIME,
  })
}

export function useJuz(juzNumber: number, lang: Language = 'en') {
  return useQuery<JuzData>({
    queryKey: quranKeys.juz(juzNumber, lang),
    queryFn: () =>
      api.get(`/quran/juz/${juzNumber}/`, { params: { lang } }).then(r => r.data),
    enabled: juzNumber >= 1 && juzNumber <= 30,
    staleTime: STALE_TIME,
  })
}

export function useTafsir(surahNumber: number, verseNumber: number, lang: Language = 'en') {
  return useQuery<TafsirDetail>({
    queryKey: quranKeys.tafsir(surahNumber, verseNumber, lang),
    queryFn: () =>
      api.get(`/quran/surahs/${surahNumber}/verses/${verseNumber}/tafsir/`, { params: { lang } }).then(r => r.data),
    enabled: surahNumber >= 1 && verseNumber >= 1,
    staleTime: STALE_TIME,
    retry: false,
  })
}

export function useNavigationData() {
  return useQuery<NavigationData>({
    queryKey: quranKeys.navigation,
    queryFn: () => api.get('/quran/navigation/').then(r => r.data),
    staleTime: STALE_TIME,
    gcTime: STALE_TIME * 30,
  })
}
