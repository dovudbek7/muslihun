import { useQuery } from '@tanstack/react-query'
import { api } from '@/config/api'
import type { Reciter, VerseAudioInfo, SurahAudioInfo } from '@/types/audio'

export const audioKeys = {
  reciters: ['audio', 'reciters'] as const,
  verseAudio: (s: number, v: number, r?: number) => ['audio', 'verse', s, v, r] as const,
  surahAudio: (s: number, r?: number) => ['audio', 'surah', s, r] as const,
}

export function useReciters() {
  return useQuery<Reciter[]>({
    queryKey: audioKeys.reciters,
    queryFn: () => api.get('/audio/reciters/').then(r => r.data),
    staleTime: Infinity,
  })
}

export function useVerseAudio(surahNumber: number, verseNumber: number, reciterId?: number) {
  return useQuery<VerseAudioInfo>({
    queryKey: audioKeys.verseAudio(surahNumber, verseNumber, reciterId),
    queryFn: () =>
      api.get(`/audio/verse/${surahNumber}/${verseNumber}/`, {
        params: reciterId ? { reciter: reciterId } : {},
      }).then(r => r.data),
    enabled: surahNumber >= 1 && verseNumber >= 1,
    staleTime: Infinity,
  })
}

export function useSurahAudio(surahNumber: number, reciterId?: number, includeVerses = false) {
  return useQuery<SurahAudioInfo>({
    queryKey: audioKeys.surahAudio(surahNumber, reciterId),
    queryFn: () =>
      api.get(`/audio/surah/${surahNumber}/`, {
        params: {
          ...(reciterId ? { reciter: reciterId } : {}),
          include_verses: includeVerses,
        },
      }).then(r => r.data),
    enabled: surahNumber >= 1 && surahNumber <= 114,
    staleTime: Infinity,
  })
}
