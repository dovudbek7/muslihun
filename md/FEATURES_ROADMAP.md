# Muslihun — Features Roadmap

Phasalar tartibida. Har bir phase mustaqil, ketma-ket qilinadi.

---

## ✅ Phase 1 — Home Page: Prayer Times Widget

> **DONE** — pushed to main

### Amalga oshirilgan
```
┌─────────────────────────────────────────┐  ← sky gradient (vaqtga qarab o'zgaradi)
│  Asaka shahri                  ⚙       │
│  6 Dhu'l-Hijjah, 1447                  │
│                                         │
│         12:08 da                        │  ← keyingi namoz vaqti (katta)
│         06:29:35 qoldi                  │  ← HH:MM:SS countdown
│                                         │
│      ╭─────────────────╮               │  ← SVG oval cubic bezier arc
│   🌙 ☀ ●  ☀  ☁  🌅  🌙               │  ← ikonkalar arc ustida
│  ○   ○   ⬤  ○   ○   ○                 │  ← ⬤ = joriy vaqt ko'chuvchi pointer
│ Bom Quy Pes Asr Shom Xuf              │
│ 03:11 04:45 12:08 16:05 19:27 21:...  │
└─────────────────────────────────────────┘
│  ══════════════════════════════════════  │  ← drag handle
│  dovudbek                   🔥 1        │
│  [Qur'on]  [Hifz]  [Tasbih] [Qidiruv] │
│  [O'qishni davom ettirish →]           │
│  Suralar ro'yxati...                   │
```

### Scroll Behavior (Payme uslubi) — amalga oshirildi
- Widget: `sticky top-0 z-0` — joyida qoladi
- Content card: `z-10, -mt-8, rounded-t-[28px]` — scroll qilganda widget ustiga chiqib yopadi
- `useScrollPosition` hook kerak bo'lmadi — sodda CSS z-index overlap yetarli

### Sky Gradient (6 davr)
| Davr | Vaqt | Rang |
|------|------|------|
| night | Xufton → Bomdod | `#080E1F → #0D1A3A` |
| dawn | Bomdod → Quyosh | `#0D1033 → #D4622A → #E89040` |
| morning | Quyosh → Peshin | `#E8904A → #87CEEB → #4A90C4` |
| midday | Peshin → Asr | `#2160A8 → #87CEEB → #B8E0F4` |
| afternoon | Asr → Shom | `#5AA8D8 → #E8C870 → #E89040` |
| sunset | Shom → Xufton | `#E07832 → #8B2252 → #1E0A2A` |

### Responsive / Ko'p Qurilma
| Qurilma | Widget | Scroll effekti | Arc |
|---------|--------|---------------|-----|
| 📱 Tel | `sticky top-0`, to'liq ekran kenglik | content pastdan chiqib yopadi | SVG stretches, pointer ko'rinadi |
| 💻 Komp | `max-w-2xl` ichida, `lg:pt-8`, katta shriftlar | bir xil sticky behavior | arc wider but proportional |
| 🖥️ Tablet | Tel bilan bir xil | bir xil | bir xil |

- Desktop: `lg:text-[56px]` time, `lg:text-lg` city — kattaroq
- Arc: `preserveAspectRatio="none"` → har qanday kenglikda to'g'ri ko'rinadi
- Sky gradient: barcha qurilmalarda bir xil (CSS `background` property)

### Yaratilgan fayllar
- `src/components/prayer/PrayerTimesWidget.tsx` — asosiy widget
- `src/components/prayer/PrayerArc.tsx` — SVG oval arc, cubic bezier `M 18 62 C 88 4, 272 4, 342 62`, joriy vaqt pointer glow bilan
- `src/hooks/useSkyBackground.ts` — 6 davr gradient, 60s interval
- `src/hooks/useCityName.ts` — Nominatim reverse geocoding, 7-kun localStorage cache
- `src/utils/hijriDate.ts` — `Intl` API islamic-umalqura
- `src/pages/Home.tsx` — to'liq qayta yozildi
- `src/App.tsx` — `showTopNav={false}` home route uchun

---

## Phase 2 — Mushaf: 3 Xil O'qish Modi

### Maqsad
Mushafda 3 xil ko'rinish rejimi: vertikal scroll, sahifa-sahifa, kattalashtirish bilan to'liq sahifa.

### Rejim 1: Vertikal Scroll (Quran Majeed uslubi)
- Qur'on matni uzluksiz, RTL, yuqoridan pastga oqib ketadi
- Surahlar orasida ornamental separator (bismi va surah sarlavha)
- Oyat raqami: doira ichida ﴿٣﴾ uslubda, Arabic numerals
- Fon: qora/qo'ng'ir dark tema, oq matn
- Pastda: Play | Bookmarks | Auto Scroll | Share | Translation | More

### Rejim 2: Sahifa-Sahifa (AlQuranUz uslubi)
- Har sahifada aniq mushaf sahifasi (604 sahifa)
- Qog'oz rangi: krem (#F5F0E8), matn: qora
- Tepada: `1-juz` (chapda), sahifa raqami (markazda), `Baqara` (o'ngda)
- Surah sarlavha: ornamental frame ichida
- Swipe left/right = keyingi/oldingi sahifa
- Fixed font size — haqiqiy mushaf proporsiyasi
- Pinch gesture qo'llab-quvvatlanmaydi (bu rejimda)

### Rejim 3: Kattalashtiriladigan To'liq Sahifa
- Xuddi Rejim 2 lekin pinch-to-zoom ishlaydi
- `react-native-gesture-handler` yoki web: CSS `transform: scale()` + touch events
- Kattalashtirish → shrift ham kattalashadi (font-size scale bilan o'sadi)
- Kichraytirish → aksi
- Min zoom: 0.8x, Max zoom: 3x
- Double tap: 1x ga qaytish

### Rejim Tanlash UI
- Mushaf sahifasida tepada kichik icon row: `↕` | `📖` | `🔍`
- Tanlov `mushafStore` da saqlanadi (persist)

### Responsive / Ko'p Qurilma
| Qurilma | Rejim 1 (Vertikal) | Rejim 2 (Sahifa) | Rejim 3 (Zoom) |
|---------|-------------------|-----------------|----------------|
| 📱 Tel | scroll + touch | swipe left/right | pinch-to-zoom |
| 💻 Komp | mouse scroll + ↑↓ klaviatura | ← → klaviatura yoki button | scroll wheel zoom (Ctrl+scroll) |
| 🖥️ Tablet | scroll + swipe | swipe | pinch-to-zoom |

- **Desktop rejim tanlash:** tepada tab yoki keyboard shortcut `1/2/3`
- **Mobile swipe:** `touchstart/touchend` delta > 50px → sahifa o'tish (Rejim 2)
- **Desktop klaviatura:** `ArrowLeft/ArrowRight` → sahifa, `ArrowUp/ArrowDown` → scroll (Rejim 1)
- Max kontent kengligi: `max-w-2xl` (672px) barcha qurilmalarda — o'rtada joylashgan

### Texnik Detallar
- `src/components/mushaf/VerticalScroll.tsx`
- `src/components/mushaf/PageView.tsx`
- `src/components/mushaf/ZoomablePageView.tsx`
- `src/stores/mushafStore.ts` — `mode: 'vertical' | 'page' | 'zoom'`, `currentPage`, `zoom`
- Backend: `GET /api/v1/quran/pages/{n}/` — mavjud
- `useKeyboardNav` hook — desktop klaviatura navigatsiyasi

---

## Phase 3 — Mushaf: Bottom Action Bar va Auto Scroll

### Maqsad
Pastki amal paneli (Quran Majeed uslubi) + Auto Scroll funksiyasi.

### Bottom Action Bar
```
[ ▶ Play ] [ ★ Bookmarks ] [ ⇊ Auto Scroll ] [ ↑ Share ] [ ع= Translation ] [ ••• More ]
```
- Agar ekran kichik → gorizontal scroll (overflow-x: auto)
- Ikonkalar: yumaloq doira fon, matn pastda
- Active holat: to'liq rang (yashil play, sariq bookmark, ...)

### Auto Scroll
- Faqat **Vertikal scroll rejimida** ishlaydi
- Yoqganda: matn avtomatik pastga siljiydi (sekin, tekis)
- Tezlik: sozlanadi (slider yoki 3 level: sekin/o'rta/tez)
- Tezlik saqlanadi `mushafStore`da
- To'xtatish: paneldan `Auto Scroll` ni yana bosish yoki manual scroll qilish

### Responsive / Ko'p Qurilma
| Qurilma | Bottom Bar | Auto Scroll |
|---------|-----------|-------------|
| 📱 Tel | `fixed bottom-0`, ustidan BottomNav yuqorida, overflow scroll | touch scroll bilan pause |
| 💻 Komp | `sticky bottom-0` content ichida, barcha tugmalar ko'rinadi (scroll yo'q) | Space tugma pause/resume |
| 🖥️ Tablet | Tel bilan bir xil | Tel bilan bir xil |

- Desktop: BottomNav yo'q (`hidden lg:flex` Sidebar bor) → ActionBar pastda ko'rinadi
- Mobile: 6 tugma sig'masa → `overflow-x: auto; scrollbar-width: none`
- Auto Scroll tezlik: tel = slider (bottom sheet), komp = +/- tugmalar yoki scroll wheel

### Texnik Detallar
- `src/components/mushaf/BottomActionBar.tsx` (yangi)
- `src/hooks/useAutoScroll.ts` — `requestAnimationFrame` loop, tezlik parametri
- `mushafStore`: `autoScroll: boolean`, `autoScrollSpeed: number`

---

## Phase 4 — Oyat Interaksiyasi: Tap, Long Press, Tafsir

### Maqsad
Oyatga bosganda pozitsiya belgilash, uzun bosganda tafsir bilan detail panel.

### Tap (Oddiy bosish)
- Bosilgan oyat highlight bo'ladi (ranglanadi)
- Faqat bitta oyat bir vaqtda highlight — boshqasini bossang, o'tadi
- Scroll qilsang ham highlight saqlanadi (joriy o'qish pozitsiyasi)

### Long Press (3 soniya+)
- 3s ushlab turganda: vibratsiya (haptic feedback: `navigator.vibrate(50)`)
- Modal/bottom sheet ochiladi:
  ```
  ┌─────────────────────────────────┐
  │  الفاتحة ﴿٤﴾                 ✕  │
  │                                 │
  │  مَٰلِكِ يَوۡمِ ٱلدِّينِ      │
  │                                 │
  │  [Tinglash] [Tafsir] [Saqlash] [Qiro'at] │
  │                                 │
  │  📖 TAFSIR (to'liq, inline)    │
  │  Matn matn matn...              │
  │  (scroll qilinadi)              │
  └─────────────────────────────────┘
  ```
- Tafsir inline chiqadi — user alohida tafsir tugmasini bosmasin
- Mavjud detail panel saqlanadi, faqat tafsir qo'shiladi

### Responsive / Ko'p Qurilma
| Qurilma | Tap | Long Press | Detail Panel |
|---------|-----|-----------|-------------|
| 📱 Tel | 1 bosish = highlight | 3s bosib turish = panel | bottom sheet (`translate-y`) |
| 💻 Komp | 1 klik = highlight | hover 1s + klik = panel | centered modal (dialog) |
| 🖥️ Tablet | Tel bilan bir xil | Tel bilan bir xil | bottom sheet |

- Desktop: `navigator.vibrate()` mavjud emas — vibratsiya skip
- Desktop panel: `position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%)` — markazda
- Mobile panel: `position: fixed; bottom: 0; left: 0; right: 0` — pastdan chiqadi
- Trigger farqi: `window.matchMedia('(pointer: coarse)')` — touch vs mouse aniqlash

### Texnik Detallar
- `src/components/VerseDetailSheet.tsx` — tafsir qo'shish
- Long press: `useLongPress` hook — 3000ms threshold (touch) / 1000ms hover (desktop)
- Tafsir API: `GET /api/v1/quran/verses/{id}/tafsir/` yoki inline `verse.tafsir`
- `src/stores/quranStore.ts` — `highlightedVerse: number | null`

---

## Phase 5 — Ovozli O'qish Tizimi (Tarteel Uslubi)

### Maqsad
Hozirgi recording tizimini 2 rejimga bo'lish + qayerdan boshlanishini avtomatik aniqlab olish.

### Muammo (hozir)
- Faqat boshidan boshlanadi — qo'llanuvchi o'rtadan o'qiy olmaydi
- Xato bo'lsa to'xtab qoladi

### Rejim 1: Mashq Modi (Practice)
- Mikrofon yonadi, user o'qiydi
- Tizim real-time: **qaysi oyat/so'z o'qilayotganini aniqlaydi** (audio fingerprinting yoki phoneme match)
- O'qilgan joy **highlight** bo'ladi — joriy so'z (word-level) va joriy oyat (ayah-level)
- Xato tekshirilmaydi — shunchaki davom etaveradi
- O'qishni to'xtatsa → highlight shu joyda qoladi
- Keyingi sessiyada shu joydan davom etadi

### Rejim 2: Tekshirish Modi (Check)
- Real-time transkripsiya + Qur'on matni bilan solishtirish
- To'g'ri o'qilgan so'z: oddiy (highlight yoki yashil)
- Xato o'qilgan so'z: **qizil** rang
- **BLOKLASHSIZ** — xato bo'lsa ham davom etaveradi, to'xtamaydi
- Xatolar ro'yxati pastda "Mistakes: 3" ko'rinadi
- Sessiya tugagach: xatolar xulosasi

### Auto-Detect Pozitsiya (Tarteel uslubi)
- User o'qiganda tizim qaysi oyatdan boshlayotganini aniqlab oladi
- Boshidan boshlashga majbur qilinmaydi
- Quran Majeed dan farqi: ular ham Tarteel ham o'rtadan boshlash imkonini beradi

### Responsive / Ko'p Qurilma
| Qurilma | Mikrofon | UI | Highlight |
|---------|---------|-----|-----------|
| 📱 Tel | built-in mic, `MediaRecorder` | to'liq ekran overlay | word + ayah level |
| 💻 Komp | external/built-in mic, HTTPS kerak | sidebar yonida panel | ayah level (word optional) |
| 🖥️ Tablet | Tel bilan bir xil | Tel bilan bir xil | Tel bilan bir xil |

- Desktop: `getUserMedia` HTTPS'da ishlaydi — lokal dev'da ham (`localhost` exempt)
- Desktop UI: Recitation panel o'ng tomonda `fixed right-0` panel ko'rinishi
- Mobile UI: pastdan chiqadigan sheet yoki to'liq ekran overlay
- Klaviatura: Space = pause/resume, Escape = to'xtatish (desktop)
- Xato ko'rsatish: tel = red highlight + gentle vibrate, komp = red highlight + tooltip

### Texnik Detallar
- `src/components/RecitationMode.tsx` — mode selector
- `src/hooks/useRecitation.ts` — mikrofon, Web Speech API yoki custom ASR
- `src/stores/recitationStore.ts` — `mode: 'practice' | 'check'`, `currentPosition`, `mistakes[]`
- Highlight sync: recitation store → mushaf store → UI
- Position detection: phoneme similarity, fuzzy match Qur'on matni bilan
- `window.matchMedia('(pointer: coarse)')` — touch/mouse UI branch

---

## Phase 6 — Tajvid Ranglash Modi

### Maqsad
Tajvid qoidalarini ranglar bilan ko'rsatish — toggle yoqsa har so'z/harf rangilanadi.

### Ranglash Sistemasi
| Rang | Tajvid Qoidasi |
|------|----------------|
| 🟢 Yashil | Ghunna (ikki harakat) |
| 🔴 Qizil | Qalqala |
| 🔵 Ko'k | Idgham |
| 🟠 To'q sariq | Ikhfa |
| 🟣 Binafsha | Mad (cho'zish) |
| ⬛ Kulrang | Qalb / Iqlab |

### UI
- Settings yoki mushaf tepasida toggle: `Tajvid: OFF/ON`
- Yoqilganda: Qur'on matni `<span>` larga bo'linadi, har biriga class
- Ranglar CSS custom properties orqali (tema bilan mos)
- Pastda yoki modal da: rang legenda (qaysi rang = qaysi qoida + qisqacha tushuntirish)

### Ma'lumot
- Tajvid ma'lumotlari: JSON format (har oyat, har so'z, tajvid kodi)
- Ma'lumot manbasi: `quran.json` bilan birga yoki alohida `tajweed.json`
- Backend model qo'shish kerak yoki frontend JSON

### Responsive / Ko'p Qurilma
| Qurilma | Toggle | Rang ko'rish | Qoida nomi |
|---------|--------|-------------|-----------|
| 📱 Tel | Settings ichida switch | rangli matn | bosish = pastdan tooltip |
| 💻 Komp | TopNav yoki Settings toggle | rangli matn | hover = floating tooltip |
| 🖥️ Tablet | Tel bilan bir xil | rangli matn | bosish = tooltip |

- Barcha qurilmalarda: CSS `<span class="tajweed-X">` — bir xil render
- Desktop hover tooltip: `position: absolute`, CSS `:hover` bilan — JS kerak emas
- Mobile tap tooltip: `useState` bilan show/hide, ekran chekkasida chiqib ketmasin (clamp)
- Rang legenda: tel = bottom sheet modal, komp = sidebar panel yoki inline accordion

### Texnik Detallar
- `src/components/TajweedText.tsx` — tajvid ranglarini render qilish
- `src/data/tajweed.json` — tajvid ma'lumotlari (so'z darajasida)
- `src/stores/settingsStore.ts` — `tajweedEnabled: boolean`
- CSS: `.tajweed-ghunna`, `.tajweed-qalqala`, ... klasslari
- Tooltip: `@media (hover: hover)` — desktop hover, aks holda click

---

## Phase 7 — Qibla Finder (Kompas)

### Maqsad
Qibla yo'nalishini ko'rsatuvchi kompas — yangi feature, Home sahifasiga tugma.

### UI
- Alohida sahifa: `/qibla`
- Kompas: animatsiyali arrow, Makka tomonga yo'naltirilgan
- Tepada: `Qibla: 247°` (gradus)
- Pastda: `Makkadan masofa: 3,456 km`
- Fon: aqiq yoki xira kompas dizayni

### Hisoblash
```
qiblaAngle = atan2(
  sin(makkLng - userLng) * cos(makkLat),
  cos(userLat)*sin(makkLat) - sin(userLat)*cos(makkLat)*cos(makkLng - userLng)
)
```
- `DeviceOrientationEvent` — telefon kompas ma'lumoti
- iOS: `requestPermission()` kerak
- Android: avtomatik

### Home sahifasiga qo'shish
- Home dagi icon grid ga: `[🧭 Qibla]` tugmasi

### Responsive / Ko'p Qurilma
| Qurilma | Kompas | Fallback |
|---------|--------|---------|
| 📱 Tel | `DeviceOrientationEvent` — real aylanuvchi kompas | Ruxsat berilmasa: statik yo'nalish |
| 💻 Komp | Gyroskop yo'q — kompas aylanmaydi | Qibla burchagi + masofa matn ko'rinishida |
| 🖥️ Tablet | Gyroskop bor bo'lsa — ishlaydi, yo'q bo'lsa komp kabi | Komp bilan bir xil |

- Desktop UI: kompas doirasi statik, faqat Makka yo'nalishi arrow ko'rsatiladi
- `'DeviceOrientationEvent' in window` — qurilma tekshirish
- iOS 13+: `DeviceOrientationEvent.requestPermission()` — user ruxsati kerak
- Android: avtomatik, ruxsat so'ralmasdan
- Kompas SVG: `transform: rotate(${angle}deg)` — universal (tel va tablet)

### Texnik Detallar
- `src/pages/QiblaPage.tsx` (yangi)
- `src/hooks/useQibla.ts` — geolocation + device orientation + hisoblash
- `src/hooks/useDeviceCompass.ts` — `DeviceOrientationEvent` wrapper
- `hasGyroscope: boolean` state — desktop fallback UI branch

---

## Bajarish Tartibi

| Phase | Nomi | Holat |
|-------|------|-------|
| 1 | Prayer Times Widget | ✅ DONE |
| 2 | Mushaf 3 rejim | ⏳ Navbatda |
| 3 | Bottom Bar + Auto Scroll | ⏳ Navbatda |
| 4 | Oyat interaksiyasi + Tafsir | ⏳ Navbatda |
| 5 | Ovozli o'qish tizimi | ⏳ Navbatda |
| 6 | Tajvid ranglash | ⏳ Navbatda |
| 7 | Qibla Finder | ⏳ Navbatda |

---

## Git Workflow (Har Phase Tugagach)

Har bir phase to'liq tugagach:

```bash
# 1. Build tekshirish
npm run build && npm test

# 2. Stage qilish
git add src/components/... src/hooks/... src/stores/...

# 3. Commit (inglizcha, aniq)
git commit -m "feat(phase-N): short description

- bullet: what was added
- bullet: what was changed
- bullet: key technical detail"

# 4. Push
git push origin main
```

### Commit Format (Conventional Commits)

| Type | Qachon |
|------|--------|
| `feat(phase-1):` | Prayer times widget |
| `feat(phase-2):` | Mushaf reading modes |
| `feat(phase-3):` | Bottom action bar + auto scroll |
| `feat(phase-4):` | Verse interaction + tafsir panel |
| `feat(phase-5):` | Voice recitation system |
| `feat(phase-6):` | Tajweed coloring mode |
| `feat(phase-7):` | Qibla finder compass |

### Amalga oshirilgan Commit (Phase 1)
```
feat(phase-1): add prayer times widget with dynamic sky and oval arc

- PrayerTimesWidget: city (Nominatim), Hijri date, next prayer, HH:MM:SS countdown
- PrayerArc: SVG cubic bezier oval arc, 6 prayer dots, glowing current-time pointer
- useSkyBackground: 6 sky periods (night/dawn/morning/midday/afternoon/sunset)
- useCityName: Nominatim reverse geocoding with 7-day localStorage cache
- Home: Payme-style sticky widget (z-0) + content card (z-10, -mt-8)
- Responsive: lg:pt-8, lg:text-[56px] for desktop
```

---

*Yaratildi: 2026-05-23*
