export const ROUTES = {
  HOME: '/',
  SURAHS: '/surahs',
  READER: '/read',
  READER_SURAH: '/read/surah/:surahNumber',
  READER_PAGE: '/read/page/:pageNumber',
  READER_JUZ: '/read/juz/:juzNumber',
  SEARCH: '/search',
  HIFZ: '/hifz',
  HIFZ_SESSION: '/hifz/session/:surahNumber',
  HIFZ_ERRORS: '/hifz/errors',
  TASBIH: '/tasbih',
  RECITE: '/recite/:surahId',
  PROFILE: '/profile',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
} as const

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES]

export const buildRoute = {
  surah: (n: number) => `/read/surah/${n}`,
  page: (n: number) => `/read/page/${n}`,
  juz: (n: number) => `/read/juz/${n}`,
  hifzSession: (surahNumber: number) => `/hifz/session/${surahNumber}`,
  recite: (surahId: number) => `/recite/${surahId}`,
}
