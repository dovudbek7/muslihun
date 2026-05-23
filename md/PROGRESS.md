# MUSLIHUN — Progress

## BACKEND (`muslihun-backend/`) ✅ TAYYOR

```
.env.example
requirements.txt
manage.py

config/
  settings/base.py         — INSTALLED_APPS, REST_FRAMEWORK, JWT, Redis, Celery
  settings/development.py  — DEBUG=True, CORS_ALLOW_ALL_ORIGINS=True
  settings/production.py   — Security headers, S3, SMTP
  urls.py                  — API v1 routes
  asgi.py                  — channels ProtocolTypeRouter
  wsgi.py

core/
  cache.py       — QuranCacheKeys, SearchCacheKeys
  exceptions.py  — custom_exception_handler
  middleware.py  — RequestTimingMiddleware (X-Response-Time)
  pagination.py  — StandardPagination
  utils.py       — normalize_arabic, cyrillic_to_latin, is_arabic

apps/accounts/
  models.py      — User (AbstractUser), preferred_language, reading_mode, font_size, tajweed/arabic/zen booleans, last_read_*
  serializers.py — UserRegistration, UserProfile, UserPreferences, CustomTokenObtainPair
  views.py
  urls.py        — register, login, refresh, logout, profile, preferences, last-read

apps/quran/
  models.py      — Surah, Verse, Translation, Tafsir, PageMapping
  services.py    — get_surah_list/detail/page_verses/juz_verses/verse_tafsir (Redis 24h cache)
  views.py
  urls.py        — surahs/, surahs/{n}/, surahs/{n}/verses/{v}/, pages/{n}/, juz/{n}/, navigation/
  management/commands/import_quran.py — JUZ_BOUNDARIES (30), SURAH_PAGE_START (114), SAJDA_VERSES (15)

apps/search/
  services.py    — rapidfuzz WRatio, SURAH_ALIASES (uz/ru/en/tr), Arabic normalized search, 5min cache
  views.py
  urls.py

apps/audio/
  models.py      — Reciter (get_verse_url/get_surah_url), AudioEdition, UserPlaybackHistory
  serializers.py
  views.py       — DEFAULT_RECITERS seed, CDN URL generation
  urls.py

apps/hifz/
  models.py      — HifzProgress (SM-2: ease_factor/interval/repetitions/next_review), ErrorLog (RED/YELLOW)
  services.py    — get_due_verses, get_weak_verses, get_error_stats, get_surah_progress
  serializers.py
  views.py
  urls.py

apps/prayer/
  services.py    — Aladhan API, Redis 6h cache, Tashkent fallback
  serializers.py
  views.py
  urls.py

apps/gamification/
  models.py      — Streak (freeze logic, longest_streak), TasbihSession (increment → completed), Achievement
  services.py    — seed_default_dhikr (5 zikr), seed_default_achievements (streak milestones), _check_streak_achievements
  serializers.py
  views.py
  urls.py

migrations/      — barcha 7 app uchun 0001_initial.py mavjud
```

**Notes:**
- Python 3.9 — `Optional[X]` ishlatilgan (`X | None` emas)
- SQLite (dev), PostgreSQL (prod) — `DATABASES` comment/uncomment
- `manage.py check` o'tadi

---

## FRONTEND (`muslihun/src/`) ✅ TAYYOR

```
App.tsx          — Routes: /, /read, /read/surah/:n, /read/page/:n, /read/juz/:n,
                   /search, /hifz, /hifz/session/:n, /tasbih, /profile,
                   /auth/login, /auth/register
main.tsx         — QueryClient (staleTime 5m, gcTime 24h) + persistQueryClient (localStorage, 24h maxAge) + BrowserRouter
index.css        — @font-face (font-display:block), .arabic-text, .card, .btn-primary, safe-area

types/
  quran.ts       — Language, ReadingMode, Verse, Translation, Tafsir, Surah, PageData, JuzData, NavigationData
  auth.ts        — User, AuthTokens, LoginPayload, RegisterPayload, LoginResponse, RegisterResponse, UserPreferences
  audio.ts       — PlaybackMode, Reciter, VerseAudioInfo, SurahAudioInfo, AudioPlayerState
  hifz.ts        — HifzMode, HifzStatus, ErrorType, HifzSession, HifzProgress (SM-2 fields), ErrorLog, SurahProgressStats, HifzDashboard, TranscribeWord, TranscribeResult
  prayer.ts      — PrayerTimings, NextPrayer, PrayerTimesData, PRAYER_NAMES_UZ
  gamification.ts — Streak, TasbihDhikr, TasbihSession, TasbihIncrementResponse, Achievement, UserAchievement, GamificationDashboard
  api.ts         — PaginatedResponse<T>, ApiError, SearchResult, SearchResponse

constants/
  routes.ts      — ROUTES const, buildRoute helper
  quran.ts       — TOTAL_SURAHS/PAGES/JUZZ, FONT_SIZE_*, ARABIC_FONT_SIZE_CLASSES, LANGUAGE_LABELS

config/
  api.ts         — Axios instance, Bearer token interceptor, 401 auto-refresh, redirect to /auth/login on fail

api/
  quran.ts       — quranKeys, useSurahs/useSurah/useVerse/usePage/useJuz/useTafsir/useNavigationData (24h staleTime)
  auth.ts        — useLogin (localStorage+Zustand), useRegister, useLogout (blacklist), useProfile, useUpdatePreferences, useUpdateLastRead
  search.ts      — useSearch (5min staleTime, enabled >=1 char, placeholderData)
  audio.ts       — useReciters (staleTime:Infinity), useVerseAudio, useSurahAudio
  prayer.ts      — usePrayerTimes (6h staleTime, lat/lon nullable check)
  hifz.ts        — useHifzSessions, useStartHifzSession, useEndHifzSession, useHifzProgress, useDueVerses, useSubmitReview, useErrorLogs, useLogError, useErrorStats, useSurahProgress, useHifzDashboard, useTranscribeVerse
  gamification.ts — useStreak, useRecordActivity (optimistic), useTasbihDhikr, useTasbihSessions, useCreateTasbihSession, useIncrementTasbih, useAchievements, useMyAchievements, useGamificationDashboard

stores/
  authStore.ts   — persisted:'muslihun-auth', setAuth/updateUser/clearAuth
  quranStore.ts  — persisted:'muslihun-quran', currentSurah/Verse/Page/Juz, fontSize/language/tajweed/arabicOnly/zen, openTafsir/navigateTo
  audioStore.ts  — isPlaying/currentSurah/currentVerse/mode/volume/isMuted/audioUrl, play/pause/resume/stop/nextVerse; verse=null for surah-level
  uiStore.ts     — persisted:'muslihun-ui', theme('dark'|'light'|'gray'), activeDrawer, isSearchOpen, notification (auto-clear 3s), setTheme (sets data-theme attr)

hooks/
  useDebounce.ts      — generic debounce, default 400ms
  useGeolocation.ts   — caches coords 24h, fallback Tashkent (41.3, 69.3)
  useLocalStorage.ts  — typed localStorage hook
  useAudioPlayer.ts   — HTMLAudio element, timeupdate/ended/waiting events, loop support
  usePrayerTimes.ts   — usePrayerCountdown (1s interval, NextPrayer obj), formatCountdown helper

components/ui/
  cn.ts          — clsx + twMerge
  Button.tsx     — motion.button, variants (primary/ghost/outline/danger), sizes, loading spinner
  Spinner.tsx    — animated border spinner
  Modal.tsx      — AnimatePresence + spring, ESC, backdrop click
  Drawer.tsx     — 3-sided (bottom/right/left) + spring + backdrop
  Badge.tsx      — variants (default/accent/success/error/warning/muted)
  Input.tsx      — labeled, leftIcon/rightIcon, error display
  Toast.tsx      — AnimatePresence, success/error/info icons+colors, auto-clear

components/layout/
  TopNav.tsx         — sticky, PrayerCountdown + 3 NavPills + CurrentPrayer, hidden zenMode
  BottomNav.tsx      — fixed bottom, 5 tabs (Quran/Search/Hifz/Tasbih/Profile), active animations
  Sidebar.tsx        — desktop only (lg:flex), 20/56px sidebar with same nav items + Settings button
  Layout.tsx         — Sidebar + (TopNav + main + BottomNav + AudioPlayerBar) + all Drawers + SettingsDrawer

components/quran/
  ArabicText.tsx     — font-arabic, fontSize from store, tajweed dangerouslySetInnerHTML
  VerseCard.tsx      — ripple, verse#, ArabicText, transliteration, translation, Play+Tafsir actions; audio URL ar.alafasy
  TafsirPanel.tsx    — bottom sheet (80vh), Arabic verse + source + content, loading/error states
  MushafView.tsx     — book-style page: gold ornamental header, bismillah, flowing Arabic verses with ﴿n﴾ markers

components/settings/
  SettingsDrawer.tsx — theme picker (dark/light/gray), reading mode (scroll/mushaf), font size (4 sizes), tajweed/arabicOnly/transliteration toggles, reciter list

components/audio/
  AudioPlayerBar.tsx — fixed above BottomNav, progress bar (clickable seek), play/pause/stop, loop toggle, volume slider

components/search/
  SearchOverlay.tsx  — fullscreen overlay, debounce 400ms, result items (arabic + matched_text), navigate on select

components/navigation/
  NavigationDrawer.tsx — 3-tab Drawer: Surah list (searchable), Page grid (604), Juz grid (30)

components/prayer/
  PrayerCountdown.tsx   — countdown timer + CurrentPrayer component
  PrayerTimesWidget.tsx — full-width home header: city (Nominatim), Hijri date, next prayer time big, HH:MM:SS countdown, oval arc (PrayerArc), sky gradient bg (useSkyBackground), settings button
  PrayerArc.tsx         — SVG cubic bezier oval arc, 6 prayer dots, glowing current-time pointer moves by real clock

hooks/
  useSkyBackground.ts — 6 sky periods (night/dawn/morning/midday/afternoon/sunset), gradient string, 60s interval
  useCityName.ts      — Nominatim reverse geocoding, 7-day localStorage cache

utils/
  hijriDate.ts — getHijriDate() via Intl API (islamic-umalqura calendar), strips "AH" suffix

pages/
  Home.tsx       — Payme-style: PrayerTimesWidget sticky z-0 + content card z-10 -mt-8 slides over; 2x2 grid, last read, top-10 sura list
  Reader.tsx     — scroll mode (VerseCard list) + mushaf mode (MushafView), Play Surah button, Settings2→SettingsDrawer; name_transliteration
  Search.tsx     — standalone search page (back button, input, results)
  Hifz.tsx       — 4 tabs: Takror (SM-2 flip cards + blind mode + STT mic → Whisper match%), Suralar (start session → auto-switch to Takror), Xatolar (RED/YELLOW log), Statistika (dashboard: status counts, 7-day bar chart, top surahs progress bars)
  Tasbih.tsx     — fallback dhikr (5 local zikr when backend fails), offline-safe local counting + optional backend sync
  Profile.tsx    — user info, streak stats, reading settings (toggles+font slider), language grid, logout
  auth/Login.tsx     — email+password, show/hide, error display, guest link
  auth/Register.tsx  — email+username+password+confirm, field-level errors
```

**Theme system:** CSS custom properties (--bg-primary etc.), 3 themes (dark/light/gray) via `data-theme` attr on `<html>`, persisted in localStorage.  
**Audio CDN:** `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/{n}.mp3` (surah), `.../audio/128/ar.alafasy/{sss}{vvv}.mp3` (verse).  
**Desktop:** Sidebar (hidden lg:flex), max-w-2xl center column. Home: sticky widget full-width in content area, responsive font sizes (lg:text-lg, lg:text-[56px]).  
**Build status:** `✓ 2129 modules transformed` — 0 TypeScript xato

---

## KEYINGI ETAPLAR

### Phase 3 — Features ✅ TAYYOR
- [ ] `public/fonts/UthmanicHafs_V22.woff2` — font fayl qo'yish (manual: binary file)
- [x] Reader: scroll position save (sessionStorage, per-surah key) + IntersectionObserver (VerseCard, threshold 0.5)
- [x] Audio: next verse auto-play chain (audioStore.nextVerse builds CDN URL; useAudioPlayer calls on ended)
- [x] Hifz: blind mode toggle (hides verse ref + changes button label to "Tekshirish")
- [x] **Hifz bug fix**: backend SessionListCreateView.perform_create() bulk-creates HifzProgress for all surah verses; frontend invalidates due-verses query on session start

### Phase 4 — Polish ✅ TAYYOR
- [x] Page transitions (motion.div key=location.pathname in Layout, AnimatePresence mode="wait")
- [x] Skeleton loading (VerseCardSkeleton shimmer in Reader loading state)
- [x] Pull-to-refresh (touch gesture in Layout, invalidateQueries on pull threshold)
- [x] Zen mode enter/exit animation (AnimatePresence on TopNav/BottomNav/AudioPlayerBar)

### Phase 5 — Optimization ✅ TAYYOR
- [x] `React.lazy` + `Suspense` — all 8 pages lazy-loaded, separate chunks (Reader 11kb, Hifz 9kb, ...)
- [x] PWA manifest (`public/manifest.json`, `<link rel="manifest">`, apple meta tags)
- [ ] Font + critical CSS preloading (UthmanicHafs_V22.woff2 fayl qo'yilsa kerak — manual)
- [x] **Mushaf bug fix**: prev/next page navigation buttons added to MushafView; removed surah dependency from render condition (`readingMode === 'mushaf' && verses.length > 0`)

### Phase 6 — New Features & Optimizations ✅ TAYYOR
- [x] **Feature 1: STT Hifz (Whisper AI)** — backend `POST /hifz/transcribe/` (OpenAI Whisper `whisper-1`, `language='ar'`, word-level compare via `normalize_arabic`); frontend `useAudioRecorder` hook (MediaRecorder API), `useTranscribeVerse` mutation, mic button in ReviewList with match% + word highlight
- [x] **Feature 2: Hifz Dashboard & Statistics** — backend `GET /hifz/dashboard/` (`get_hifz_dashboard` service: status_counts, 7-day daily_reviews, top_surahs); frontend `useHifzDashboard`, `StatsTab` component (4 status cards, bar chart, top surahs progress bars, total+due count), 4th "Statistika" tab in Hifz page
- [x] **Optimization 1: persistQueryClient** — `@tanstack/react-query-persist-client` + `@tanstack/query-sync-storage-persister` in `main.tsx`; offline cache 24h, gcTime changed 30m→24h
- [x] **Optimization 2: useMemo NavigationDrawer** — `pageNumbers` memoized with `useMemo(() => Array.from({length:604},...), [])` in NavigationDrawer

### Phase 8 — Home Redesign (Prayer Widget) ✅ TAYYOR
- [x] PrayerTimesWidget: city (Nominatim API + localStorage), Hijri date (Intl), big next-prayer time, HH:MM:SS countdown
- [x] PrayerArc: SVG cubic bezier oval arc — 6 fixed prayer dots + glowing moving current-time pointer
- [x] useSkyBackground: night/dawn/morning/midday/afternoon/sunset gradients, 60s update interval
- [x] useCityName: Nominatim reverse geocoding, 7-day cache, graceful fallback
- [x] Home: Payme-style sticky widget (z-0) + scrollable content card (z-10, -mt-8, rounded-t-3xl)
- [x] App.tsx: showTopNav=false for home, tsconfig ignoreDeprecations 6.0→5.0 (TS 5.9 fix)
- [x] Responsive: lg:pt-8, lg:text-lg, lg:text-[56px] — works on mobile + desktop

### Phase 7 — Deploy
- [ ] `docker-compose.yml` — Django + Celery + Redis + Nginx
- [ ] Frontend Nginx config (SPA fallback, gzip, cache headers)
- [ ] GitHub Actions CI/CD (test + build + deploy)
- [ ] Production `.env` to'ldirish
- [ ] SSL / domain setup
