# Muslihun — Features Roadmap

Phasalar tartibida. Har bir phase mustaqil, ketma-ket qilinadi.

---

## Phase 1 — Home Page: Prayer Times Widget

### Maqsad
Asosiy sahifada tepaga namoz vaqtlarini AlQuranUz uslubida chiqarish + Payme uslubida scroll qilganda yig'ilishi.

### UI Tuzilmasi
```
┌─────────────────────────────────────┐
│  Shahar nomi          🔔 (notification)│
│  Hijriy sana                        │
│                                     │
│         04:45 (keyingi namoz)       │
│         00:16:09 qoldi              │
│                                     │
│  ○────●────○────○────○────○         │
│ Bomdod Quyosh Peshin Asr Shom Xufton│
│  03:11  04:45  12:07 17:17 19:34 21:03│
└─────────────────────────────────────┘
│  [Qur'on] [Al-Fatiha] [Audio] ...   │  ← bu qism scroll qiladi
│                                     │
```

### Scroll Behavior (Payme uslubi)
- Widget tepada `position: sticky` yoki parallax — scroll qilganda pastdagi kontent USTIGA chiqib keladi va widget yopiladi (overlap)
- Widget to'liq yopilganda: faqat kichik status bar qoladi (joriy namoz nomi + vaqt)
- Qaytganda (scroll yuqoriga) — widget yana ochiladi, smooth animation

### Texnik Detallar
- `PrayerTimesWidget` — alohida komponent, home page tepasida
- Scroll listener → `useScrollPosition` hook → threshold'ga yetganda collapse
- Arc/timeline: SVG yoki CSS gradient line, active namoz ball bilan belgilanadi
- Countdown: `useInterval` 1s, keyingi namoz vaqtiga qadar
- Ma'lumot: mavjud backend `/api/v1/prayer/times/?lat=&lon=` dan
- Geolocation: `navigator.geolocation` API, ruxsat so'rash
- Hijriy sana: `Intl` yoki `hijri-js` kutubxona

### Fayllar
- `src/components/PrayerTimesWidget.tsx` (yangi)
- `src/pages/Home.tsx` — widget qo'shish, scroll listener
- `src/hooks/usePrayerTimes.ts` — API call, countdown logika

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

### Texnik Detallar
- `src/components/mushaf/VerticalScroll.tsx`
- `src/components/mushaf/PageView.tsx`
- `src/components/mushaf/ZoomablePageView.tsx`
- `src/stores/mushafStore.ts` — `mode: 'vertical' | 'page' | 'zoom'`, `currentPage`, `zoom`
- Backend: `GET /api/v1/quran/pages/{n}/` — mavjud

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

### Texnik Detallar
- `src/components/VerseDetailSheet.tsx` — tafsir qo'shish
- Long press: `useLongPress` hook — 3000ms threshold, `onLongPress` callback
- Tafsir API: `GET /api/v1/quran/verses/{id}/tafsir/` (backend mavjud bo'lsa) yoki inline `verse.tafsir`
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

### Texnik Detallar
- `src/components/RecitationMode.tsx` — mode selector
- `src/hooks/useRecitation.ts` — mikrofon, Web Speech API yoki custom ASR
- `src/stores/recitationStore.ts` — `mode: 'practice' | 'check'`, `currentPosition`, `mistakes[]`
- Highlight sync: recitation store → mushaf store → UI
- Position detection: phoneme similarity, fuzzy match Qur'on matni bilan

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

### Texnik Detallar
- `src/components/TajweedText.tsx` — tajvid ranglarini render qilish
- `src/data/tajweed.json` — tajvid ma'lumotlari (so'z darajasida)
- `src/stores/settingsStore.ts` — `tajweedEnabled: boolean`
- CSS: `.tajweed-ghunna`, `.tajweed-qalqala`, ... klasslari

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

### Texnik Detallar
- `src/pages/QiblaPage.tsx` (yangi)
- `src/hooks/useQibla.ts` — geolocation + device orientation + hisoblash
- `src/hooks/useDeviceCompass.ts` — `DeviceOrientationEvent` wrapper

---

## Bajarish Tartibi

| Phase | Nomi | Murakkablik |
|-------|------|-------------|
| 1 | Prayer Times Widget | O'rta |
| 2 | Mushaf 3 rejim | Yuqori |
| 3 | Bottom Bar + Auto Scroll | Past |
| 4 | Oyat interaksiyasi + Tafsir | O'rta |
| 5 | Ovozli o'qish tizimi | Yuqori |
| 6 | Tajvid ranglash | O'rta |
| 7 | Qibla Finder | Past |

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

### Namuna Commit (Phase 1)
```
feat(phase-1): add prayer times widget with collapsible scroll

- PrayerTimesWidget: arc timeline, 6 prayer times, countdown
- Payme-style collapse on scroll (overlap animation)
- useScrollPosition hook, usePrayerTimes hook
- Geolocation + Aladhan API integration
```

---

*Yaratildi: 2026-05-23*
