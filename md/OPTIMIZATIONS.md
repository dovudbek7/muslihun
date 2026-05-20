# Muslihun — 15 Optimization Tavsiyalari

---

## 1. ✅ React Query `persistQueryClient` — Offline Cache
Hozir har refresh'da barcha query'lar qayta fetch bo'ladi. `persistQueryClient` + `createSyncStoragePersister` (localStorage) qo'shilsa, Quron matnlari browser'da saqlanib qoladi. Cold start 0 network request.
**Fayl:** `src/main.tsx` — QueryClient config.

---

## 2. ✅ `useMemo` / `useCallback` — NavigationDrawer 604-Sahifa Grid
`NavigationDrawer`'da 604 ta button har render'da qayta yaratiladi. `useMemo` bilan `Array.from({length: 604})` bir marta hisoblansin.
**Fayl:** `src/components/navigation/NavigationDrawer.tsx:151`

---

## 3. 🖼️ VerseCard Virtual List — `react-window`
Surada 286 ta oyat bo'lsa (Al-Baqara), hammasi DOM'ga render bo'ladi → 286 ta `motion.div`. `react-window` `VariableSizeList` bilan faqat ko'rinadigan oyatlar render bo'lsin.
**Fayl:** `src/pages/Reader.tsx` — verses.map() → virtualised list.

---

## 4. 🔤 Font Preload — `<link rel="preload">`
`UthmanicHafs_V22.woff2` fayl bo'lganda, `index.html`'ga `<link rel="preload" as="font" crossorigin>` qo'shilsa, font CSS parse'dan oldin yuklanadi. FOUT yo'qoladi.
**Fayl:** `index.html` — font-display: block allaqachon bor, preload kerak.

---

## 5. 🔁 Audio Store — Stale URL Prevention
`audioStore.nextVerse()` har chaqirilganda yangi CDN URL yaratadi. URL o'zgarmaganda `useAudioPlayer` effect qayta ishlamaydi (tekshiruv bor), lekin eski URL kesh bilan muammo bo'lishi mumkin. `audio.src !== store.audioUrl` check `===` bilan emas, normalize qilib taqqoslash kerak.
**Fayl:** `src/hooks/useAudioPlayer.ts:48`

---

## 6. 🗜️ API Response — `pagination_class = None` Gamification
Hozir gamification va hifz list view'lari paginatsiya qaytaradi, frontend `r.data?.results ?? r.data` bilan tozalaydi. Backend'da kichik ro'yxatlar (dhikr, achievements) uchun `pagination_class = None` qo'yilsa, frontend simpler bo'ladi va double-read yo'qoladi.
**Fayl:** `apps/gamification/views.py`, `apps/hifz/views.py`

---

## 7. 🏎️ Quran Service — Redis Cache Extend
`apps/quran/services.py` da `get_surah_list/detail/page_verses` 24h Redis cache bor. Lekin `get_verse_tafsir` cache yo'q (har request'da DB). Tafsir ham kamida 24h cache bo'lsin.
**Fayl:** `apps/quran/services.py` — `get_verse_tafsir()`

---

## 8. 📦 Bundle — `framer-motion` Tree Shaking
`framer-motion` 114kb gzip. Ko'p component `motion.div` ishlatadi lekin faqat `opacity/y` animate qiladi. `LazyMotion` + `domAnimation` features bilan bundle ~40% kichrayadi.
**Fayl:** `src/main.tsx` — `LazyMotion` wrapper, barcha `motion.*` → `m.*`.

---

## 9. 🔍 Search Debounce — Server-Side
Hozir `useSearch` 400ms debounce bilan frontend'da ishlatiladi. Backend'da ham `?q=` parametri bo'sh kelganda hisoblash qilinadi. Backend'da `if not q: return []` early return qo'shilsin.
**Fayl:** `apps/search/views.py`

---

## 10. 📱 Pull-to-Refresh — `invalidateQueries` Scope
Hozir Layout'dagi pull-to-refresh `qc.invalidateQueries()` — BU BARCHA querylarni invalidate qiladi (prayer, streak, hifz, quran...). Faqat joriy sahifa tegishli query'lar invalidate bo'lsin. `location.pathname` bo'yicha `queryKey` filtr qilish kerak.
**Fayl:** `src/components/layout/Layout.tsx:onTouchEnd`

---

## 11. 🧠 SM-2 `apply_review_result` — `update_fields`
`HifzProgress.apply_review_result()` oxirida `self.save()` — barcha fieldlarni yozadi. `self.save(update_fields=[...])` bilan faqat o'zgargan fieldlar update bo'lsin → DB load kamayadi.
**Fayl:** `apps/hifz/models.py:91`

---

## 12. 🔐 JWT Refresh — Race Condition
`src/config/api.ts`'da 401 interceptor refresh tokenni qayta oladi. Agar bir vaqtda 3 ta request 401 kelsa, 3 ta refresh request ketadi. `isRefreshing` flag + queue pattern qo'shilsin.
**Fayl:** `src/config/api.ts` — 401 interceptor.

---

## 13. 🖥️ MushafView — Page Prefetch
Foydalanuvchi sahifa 5 da bo'lsa, sahifa 6 ni background'da oldindan fetch qilish kerak. `usePage(page + 1, language)` query `enabled: true` bilan silent prefetch bo'lsin.
**Fayl:** `src/components/quran/MushafView.tsx` yoki `src/pages/Reader.tsx`

---

## 14. 📊 Hifz `get_due_verses` — DB Index
`HifzProgress.objects.filter(user_id=user_id, next_review__lte=today)` — `next_review` va `user_id` combined index yo'q. Mavjud index: `(user, status)`, `(user, next_review)` — lekin composite filter uchun `(user_id, next_review, status)` index qo'shilsa query tezlashadi.
**Fayl:** `apps/hifz/models.py` — `Meta.indexes`

---

## 15. 🎨 CSS Custom Properties — `tailwind.config` Simplify
Hozir `bg-bg-primary`, `text-text-muted` kabi Tailwind class'lar CSS var'lar orqali ishlaydi. `tailwind.config.js`'da `extend.colors` to'liq ro'yxat bor deb taxmin qilamiz. Agar yo'q bo'lsa — CSS var'larni Tailwind config'ga birlashtirish kerak, aks holda IntelliSense ishmaydi va class'lar JIT'dan o'tkazilmaydi.
**Fayl:** `tailwind.config.js` — colors extend.

---

*Priority: 12 (JWT race) → 3 (Virtual List) → 8 (Bundle framer) → 1 (Persist cache) → 13 (Prefetch)*

---

## 16. ✂️ Route-Based Code Splitting — Lazy Imports
Hozir barcha sahifalar bitta bundle'da. `React.lazy()` + `Suspense` bilan har route alohida chunk bo'ladi. Initial bundle ~60% kichrayadi.
**Fayl:** `src/App.tsx` — barcha `import Page` → `const Page = lazy(() => import('./pages/Page'))`.

---

## 17. 🗜️ Brotli/Gzip Compression — Nginx Config
Static asset'lar compress bo'lmasa, 163kb vendor bundle 163kb uzatiladi. Nginx'da `gzip on; brotli on;` qo'shilsa 42kb gacha tushadi.
**Fayl:** `nginx.conf` yoki `docker-compose.yml` nginx service config.

---

## 18. 🌐 CDN Static Assets — Cloudflare
`/fonts`, `/assets` Cloudflare CDN orqali uzatilsa edge cacheing ishlaydi. TTL: 1 yil immutable. JS/CSS hashed filename'lar already immutable.
**Fayl:** Deployment config — `STATIC_URL` Django → Cloudflare R2 yoki S3 + CDN.

---

## 19. ⚡ Vite Rollup Chunk Strategy — Manual Chunks
Hozir vendor chunk bitta 163kb. `manualChunks` bilan: `react-core`, `framer`, `lucide`, `tanstack-query` alohida bo'ladi. Parallel fetch.
**Fayl:** `vite.config.ts` — `build.rollupOptions.output.manualChunks`.

---

## 20. 🖼️ Image Optimization — WebP + Lazy Load
Profile rasmlar va illustration'lar JPEG/PNG. WebP formatiga konversiya + `loading="lazy"` + `fetchpriority="low"`. LCP metric yaxshilanadi.
**Fayl:** Django `ImageField` → `django-imagekit` `ProcessedImageField(format='WEBP')`.

---

## 21. 🔌 Web Worker — Heavy Computation Offload
Arabic text processing, tajweed annotation, word matching — bularni main thread'da ishlash UI freeze qiladi. Web Worker'ga o'tkazish.
**Fayl:** `src/workers/tajweed.worker.ts` + `useWorker` hook (`comlink` library).

---

## 22. 🎯 Intersection Observer — Lazy Verse Rendering
Scroll rejimida oyatlar scroll qilinmaganda DOM'da bo'lsa ham render bo'ladi. `IntersectionObserver` bilan faqat viewport'da ko'rinayotganlar render bo'lsin.
**Fayl:** `src/components/quran/VerseCard.tsx` + `useIntersectionObserver` hook.

---

## 23. ⚛️ useTransition — Non-Blocking State Updates
Sura o'zgarganda oyatlar list'i o'zgartirish blocking render. `useTransition` bilan sura switch `isPending` state'da bo'lib, UI responsive qoladi.
**Fayl:** `src/pages/Reader.tsx` — `setCurrentSurah` → `startTransition(() => setCurrentSurah(...))`.

---

## 24. 🧩 Suspense Boundaries — Granular Loading
Hozir loading state komponent ichida `if (loading) return <Spinner>`. `Suspense` + `React Query suspense: true` bilan loading declarative bo'ladi.
**Fayl:** `src/pages/Reader.tsx`, `src/pages/Hifz.tsx` — `<Suspense fallback={<Skeleton />}>`.

---

## 25. 🛑 Error Boundaries — Crash Isolation
Bitta komponent xatoligi butun sahifani crash qilmasin. `ErrorBoundary` (react-error-boundary) har major section'ni wrap qilsin.
**Fayl:** `src/App.tsx` + `src/components/ErrorBoundary.tsx` — route-level wrapping.

---

## 26. 🔒 React.memo — Pure Component Memoization
`VerseCard`, `SurahListItem`, `JuzCard` har parent re-render'da qayta render bo'ladi. `React.memo()` + props equality bilan skip qilinadi.
**Fayl:** `src/components/quran/VerseCard.tsx`, `src/components/navigation/SurahListItem.tsx`.

---

## 27. 📦 Zustand Selectors — Re-render Reduction
`const store = useQuranStore()` — butun store subscribe qiladi. `useQuranStore(s => s.fontSize)` bilan faqat kerakli field subscribe.
**Fayl:** Barcha `useQuranStore()`, `useUIStore()`, `useAudioStore()` chaqiriqlar.

---

## 28. 🔄 Optimistic Updates — Instant UI Feedback
Bookmark toggle, hifz review, tasbih count — server javobini kutmay UI'ni darhol yangilash. Server xato qaytarsa rollback.
**Fayl:** `useToggleBookmark`, `useTasbihMutation` — `onMutate` + `onError` rollback pattern.

---

## 29. 📡 Stale-While-Revalidate — Background Refresh
React Query `staleTime: 0, gcTime: Infinity` kombinatsiyasi: cached data ko'rsatiladi, background'da yangilanadi. Prayer times va streak uchun.
**Fayl:** `src/api/quran.ts`, `src/api/gamification.ts` — SWR pattern per query.

---

## 30. 🚿 AbortController — Request Cancellation
Foydalanuvchi tez-tez sura o'zgartirsa, oldingi in-flight request bekor qilinmaydi, response kelganda stale data ko'rsatiladi. AbortController bilan bekor qilish.
**Fayl:** `src/config/api.ts` — axios `cancelToken` yoki `signal` per request.

---

## 31. 💾 IndexedDB Cache — Large Data Offline
`persistQueryClient` localStorage ishlatadi — max 5-10MB. Quron matni 30MB. `idb-keyval` yoki `Dexie.js` bilan IndexedDB'ga o'tkazish.
**Fayl:** `src/main.tsx` — `createAsyncStoragePersister` (`idb` backend) o'rniga `createSyncStoragePersister`.

---

## 32. 🔁 Background Sync — Offline Mutations
Oflayn holatda bookmark/tasbih/hifz o'zgarishlari queue'ga qo'yiladi. Internet qayta kelganda sync bo'ladi. Zero data loss.
**Fayl:** Service Worker `sync` event + `backgroundSync` queue + Workbox `BackgroundSyncPlugin`.

---

## 33. 🏎️ Django `select_related` — N+1 Prevention
`HifzProgress.objects.filter(user=user)` → verse access qilganda har verse uchun alohida query. `select_related('verse__surah')` bilan bitta query.
**Fayl:** `apps/hifz/views.py`, `apps/quran/views.py` — QuerySet optimization.

---

## 34. 📊 Django `prefetch_related` — Reverse Relations
`Surah.objects.all()` keyin `surah.verses.count()` → N+1. `prefetch_related(Prefetch('verses', queryset=Verse.objects.only('id')))` bilan fix.
**Fayl:** `apps/quran/views.py` — surah list view.

---

## 35. 🗄️ Materialized View — Hifz Statistics
`/hifz/stats/` endpoint har so'rovda aggregation hisoblaydi (`COUNT`, `AVG`, `MAX` GROUP BY). PostgreSQL materialized view bilan pre-compute. 1 soatda bir yangilanadi.
**Fayl:** `apps/hifz/migrations/` — raw SQL materialized view + `RefreshMaterializedView` Celery task.

---

## 36. 🔴 Redis Sorted Set — Leaderboard
Leaderboard hisoblash Django ORM'dan DB aggregation kerak. Redis `ZADD/ZRANGE` bilan O(log N) leaderboard. Hifz review'da score yangilanadi.
**Fayl:** `apps/gamification/services.py` — `django-redis` + sorted set `leaderboard:weekly`.

---

## 37. 📝 Django `only()` / `defer()` — Field Selection
`Verse.objects.all()` barcha fieldlarni oladi (text_arabic, transliteration, page_number...). List view'da faqat kerakli fieldlar: `.only('id', 'number', 'text_arabic')`.
**Fayl:** `apps/quran/views.py`, `apps/hifz/views.py` — QuerySet `.only()`.

---

## 38. 🔗 Connection Pooling — PgBouncer
Django har request'da DB connection ochishi mumkin (agar pooling yo'q). PgBouncer transaction mode bilan connection pooling. Prod'da muhim.
**Fayl:** `docker-compose.yml` — `pgbouncer` service + Django `DATABASES` host → pgbouncer.

---

## 39. ⚡ Django `StreamingHttpResponse` — Large Exports
Bookmark/hifz export'da 1000+ row bo'lsa, butun response buffer'da yasaladi. `StreamingHttpResponse` + generator bilan chunked response.
**Fayl:** `apps/quran/views.py` — export endpoint.

---

## 40. 🎭 CSS Containment — Layout Isolation
`contain: layout style paint` CSS property bilan browser oyat card'larning layout hisoblashini izolyatsiya qiladi. Scroll performance yaxshilanadi.
**Fayl:** `src/components/quran/VerseCard.tsx` — className `contain-layout` yoki inline style.

---

## 41. 🌊 requestAnimationFrame — Smooth Progress Bar
AudioPlayerBar progress slider `setInterval` bilan yangilanayotgan bo'lsa, `requestAnimationFrame` bilan 60fps animatsiya. CPU load kamayadi.
**Fayl:** `src/hooks/useAudioPlayer.ts` — progress update loop.

---

## 42. 🔐 HTTP Security Headers — Django Middleware
`Content-Security-Policy`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`. Django `SecurityMiddleware` sozlamalari.
**Fayl:** `muslihun_backend/settings/base.py` — `SECURE_*` settings.

---

## 43. 📱 Touch Event Optimization — Passive Listeners
`addEventListener('touchstart', handler)` default'da passive emas → scroll blocking. `{ passive: true }` qo'shilsa scroll snappy bo'ladi.
**Fayl:** `src/components/layout/Layout.tsx` — touch listeners + React `onTouchStart` passive workaround.

---

## 44. 🗂️ React Query Garbage Collection — gcTime Tuning
Hozir `gcTime` default 5 daqiqa. Quron matni uchun `gcTime: Infinity` (ma'lumot o'zgarmaydi). Prayer times uchun `gcTime: 60s`. Per-query tuning.
**Fayl:** `src/api/quran.ts`, `src/api/prayer.ts` — `gcTime` per query type.

---

## 45. 📉 Bundle Analyzer — Size Audit
`rollup-plugin-visualizer` bilan bundle composition ko'riladi — qaysi dependency eng katta ekan. Har deploy'da size regression check.
**Fayl:** `vite.config.ts` + CI `npm run build -- --report`.

---

## 46. 🔤 Font Subsetting — Arabic Font Size Reduction
`UthmanicHafs_V22.woff2` to'liq font ~2MB. `pyftsubset` yoki `glyphhanger` bilan faqat ishlatilayotgan glyph'lar saqlanadi → ~400KB.
**Fayl:** `public/fonts/` + build script `scripts/subset-font.sh`.

---

## 47. 🌿 Tree Shaking — Lucide Icons
`import { Home, BookOpen, ... } from 'lucide-react'` — named import'lar tree-shaked. Lekin agar `import * as Icons` bo'lsa barcha icons bundle'ga kiradi. Audit qilish kerak.
**Fayl:** Barcha component'lar — `grep -r "from 'lucide-react'"` named import tekshiruvi.

---

## 48. 🔄 Polling Strategy — Prayer Times Refresh
Prayer times kuniga bir marta o'zgaradi. Agar `refetchInterval: 60000` (1 daqiqa) bo'lsa, 1440 ta keraksiz request ketadi. `staleTime: 3600000` (1 soat) etarli.
**Fayl:** `src/api/prayer.ts` yoki `useQuery` prayer config.

---

## 49. 🧹 Event Listener Cleanup — Memory Leaks
`useEffect` ichida `window.addEventListener` qo'shilsa cleanup qaytarilmasa, komponent unmount'dan keyin listener yashashda davom etadi → memory leak.
**Fayl:** `src/hooks/useAudioPlayer.ts`, `src/components/layout/Layout.tsx` — cleanup functions.

---

## 50. 📐 CSS Critical Path — Above-the-Fold Inline
Index.html'da `<style>` tag bilan above-the-fold CSS inline qilinsa, birinchi render'da CSS file'ni kutish shart emas. FCP yaxshilanadi.
**Fayl:** `index.html` + Vite `vite-plugin-critical` yoki manual critical CSS.

---

## 51. 🏗️ Django `bulk_create` / `bulk_update` — Batch DB Ops
Hifz bulk review'da har oyat uchun alohida `save()` — N ta query. `HifzProgress.objects.bulk_update(items, fields=[...])` bilan 1 ta query.
**Fayl:** `apps/hifz/views.py` — bulk review endpoint.

---

## 52. ⏱️ Django Cacheops — Model-Level Caching
`django-cacheops` bilan `Surah`, `Verse`, `JuzBoundary` model query'lar avtomatik Redis'da cache bo'ladi. Invalidation signal bilan.
**Fayl:** `muslihun_backend/settings/base.py` — `CACHEOPS` config.

---

## 53. 🔀 React `startTransition` — Search Input
Search input'da har harf bosilganda `setQuery` → verse list re-filter → blocking render. `startTransition` bilan filter non-blocking.
**Fayl:** `src/pages/Search.tsx` — `onChange` handler.

---

## 54. 📊 Web Vitals — Monitoring
`web-vitals` library bilan LCP, CLS, FID, FCP, TTFB metrikalari o'lchanadi va backend'ga yuboriladi. Performance regression track qilinadi.
**Fayl:** `src/main.tsx` + `reportWebVitals(sendToAnalytics)` + Django `PerformanceLog` model.

---

## 55. 🔗 Preconnect — Third-Party Origins
`cdn.islamic.network` (audio CDN), `fonts.googleapis.com` — bu originsga birinchi request'da DNS + TCP + TLS bor. `<link rel="preconnect">` bilan oldindan connect.
**Fayl:** `index.html` — `<link rel="preconnect" href="https://cdn.islamic.network">`.

---

## 56. 🛠️ Django `DEBUG_TOOLBAR` — Query Profiling (Dev)
Development'da `django-debug-toolbar` bilan SQL query count, duplicate query, slow query (>100ms) ko'rish. N+1 topish uchun zarur.
**Fayl:** `muslihun_backend/settings/dev.py` + `urls.py` debug toolbar route.

---

## 57. 📦 Shared Worker — Cross-Tab Audio State
Bir vaqtda 2 ta tab ochilsa, ikkalasi alohida audio play qilishga harakat qilishi mumkin. `SharedWorker` bilan audio state cross-tab sync.
**Fayl:** `src/workers/audio-sync.worker.ts` + `useSharedAudioState` hook.

---

## 58. 🌐 HTTP/2 Server Push — Critical Resources
Nginx HTTP/2 push bilan `index.html` yuborilganda `main.js` va `style.css` ham push qilinadi. Waterfall yo'qoladi.
**Fayl:** `nginx.conf` — `http2_push` directives.

---

## 59. 🔋 Battery API — Low Battery Mode
Qurilma batareyasi 15% dan kam bo'lsa, animatsiyalar o'chiriladi, audio quality pasayadi, prefetch to'xtatiladi.
**Fayl:** `src/hooks/useBatteryMode.ts` — `navigator.getBattery()` + store flag.

---

## 60. 📡 WebSocket Reuse — Connection Pooling
Hifz STT uchun har recording'da yangi WebSocket ochilsa, connection overhead bor. Pool'da bitta persistent connection, multiplexing.
**Fayl:** `src/hooks/useSTT.ts` — singleton WebSocket pattern.

---

## 61. 🗃️ Django `queryset.iterator()` — Large Exports
Export endpoint'da `queryset.all()` barcha ob'ektlarni RAM'ga yuklaydi. `.iterator(chunk_size=500)` bilan memory-efficient streaming.
**Fayl:** `apps/quran/views.py` — export views.

---

## 62. ✨ CSS `will-change` — Animation Hints
Animatsiya bo'ladigan elementlar (AudioPlayerBar, Drawer) uchun `will-change: transform, opacity` qo'yilsa, browser GPU layer yaratadi oldindan.
**Fayl:** `src/components/audio/AudioPlayerBar.tsx`, `src/components/ui/Drawer.tsx`.

---

## 63. 🧮 useDeferredValue — Filter Performance
Verse list filter qilishda `useDeferredValue(searchQuery)` bilan filter computation main render'dan keyin qilinadi. UI responsive qoladi.
**Fayl:** `src/pages/Search.tsx` yoki `src/components/navigation/NavigationDrawer.tsx`.

---

## 64. 🔍 Django `explain()` — Query Plan Audit
Sekin query'lar uchun `queryset.explain(verbose=True, analyze=True)` bilan PostgreSQL EXPLAIN ANALYZE. Seq scan vs Index scan farqi ko'rinadi.
**Fayl:** Dev/staging environment — management command `scripts/explain_queries.py`.

---

## 65. 📈 Prometheus + Grafana — Backend Monitoring
`django-prometheus` bilan request latency, DB query time, cache hit rate, error rate metric'lar export. Grafana dashboard'da ko'rinadi.
**Fayl:** `muslihun_backend/settings/base.py` + `docker-compose.yml` prometheus + grafana service.
