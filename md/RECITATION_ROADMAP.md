# Qiroat Rejimi — MonkeyType Style

Foydalanuvchi suralarni o'qiydi, to'g'ri so'zlar yorqin bo'ladi, xato so'zlar qizaradi.

---

## Arxitektura

```
Dim ayah text → [Boshlash] → Mikrofon → Web Speech API
    → Arabic normalization → word match → color update
```

**Granularitet:** so'z-so'z (MonkeyType kabi harf emas, arabcha so'z murakkab)

---

## Step 1 — Arabcha Normalizatsiya Utils ✅

**Fayl:** `src/utils/arabicNormalize.ts`

- Tashkeel (harakat) stripping: `بِسْمِ` → `بسم`
- Tasdid, tanwin normallashtirish
- So'z-so'z split funksiyasi
- Ikki so'zni solishtirish (normalize qilib)

```ts
stripTashkeel(text: string): string
normalizeArabic(text: string): string
splitWords(ayah: string): string[]
wordsMatch(input: string, expected: string): boolean
```

---

## Step 2 — RecitationStore (Zustand) ✅

**Fayl:** `src/stores/recitationStore.ts`

State:
```ts
status: 'idle' | 'listening' | 'paused' | 'finished'
words: WordState[]          // { text, status: 'dim'|'correct'|'wrong'|'current' }
currentIndex: number
lastError: { recognized: string; expected: string } | null
errorCount: number
correctCount: number
```

Actions:
```ts
startSession(ayah: string)
processWord(recognizedWord: string)
reset()
pause() / resume()
```

---

## Step 3 — Web Speech API Hook ✅

**Fayl:** `src/hooks/useRecitation.ts`

- `SpeechRecognition` init (Arabic: `lang='ar-SA'`)
- `continuous: true`, `interimResults: true`
- `processedWordsRef` pattern: so'z N+1 boshlanganda N ni process qiladi (0ms kechikish)
- `onend` → auto-restart agar status `listening`
- Mikrofon permission handling
- Return: `{ isListening, start, stop, error }`

---

## Step 4 — WordToken Component ✅

**Fayl:** `src/components/quran/WordToken.tsx`

```
dim     → opacity: 0.3, color: var(--text-muted)
current → opacity: 1.0, underline yoki glow, color: var(--text-primary)
correct → opacity: 1.0, color: var(--color-success)
wrong   → opacity: 1.0, color: var(--color-error)
```

---

## Step 5 — RecitationAyah Component ✅

**Fayl:** `src/components/quran/RecitationAyah.tsx`

- Ayah textini `splitWords()` → `WordToken[]` array
- `recitationStore` dan status o'qish
- RTL flex-wrap layout
- Joriy so'z (currentIndex) scroll-into-view

---

## Step 6 — RecitationControls Component ✅

**Fayl:** `src/components/quran/RecitationControls.tsx`

UI elementlari:
- **[Boshlash]** tugmasi → `startSession()` + `start()` mic
- **[To'xtatish / Davom]** toggle
- **[Qayta]** reset
- Mikrofon indicator (animatsiyali pulsing dot)
- Progress bar: `correctCount / totalWords`
- Error counter + lastError message (qizil aytilgan / ko'k kutilgan)

---

## Step 7 — RecitationSheet (Reader ichida) ✅

**Fayl:** `src/components/quran/RecitationSheet.tsx`

- Bitta oyat uchun bottom sheet
- VerseCard → "Recite" tugmasi → `openRecitation()` store action
- Reader.tsx da `activeRecitationVerse` bo'lsa Layout render qiladi
- Mushaf view da oyat ustiga bosish → VerseActionSheet → Qiroat tugmasi → RecitationSheet

---

## Step 8 — Navigatsiya + Routing ✅

**Fayl:** `src/App.tsx`, `src/stores/quranStore.ts`

- Alohida `/recite` sahifasi o'rniga Reader ichida bottom sheet
- `activeRecitationVerse` store state orqali manage
- FAB (mic button) Layout.tsx da global — faqat reader sahifasida ko'rinadi

---

## Step 9 — Progress & Session Stats ✅ (basic)

- Session tugaganda natija: `X/Y so'z to'g'ri, Z xato`
- RecitationControls ichida real-time stats

---

## ✅ Steps 1–9 — Bajarildi

---

## Mode Tizimi — 2 xil rejim

### Mode A: Verse-by-Verse (✅ bajarildi)
Har bir oyat alohida bottom sheet da. VerseCard/MushafView → tap → RecitationSheet.

### Mode B: Continuous (✅ bajarildi)
FAB (mic button) → ContinuousSurahSheet. Barcha oyatlar bir ekranda. Hamma dim. O'qigan sari oyat-oyat yorqinlashib boradi. Avto-o'tish.

---

## Step 10 — Mode Selector UI ✅

- Bitta oyat: VerseCard/Mushaf tap → RecitationSheet
- Uzluksiz: FAB mic button → ContinuousSurahSheet

---

## Step 11 — ContinuousVerse Rendering ✅

**Fayl:** `src/components/quran/ContinuousSurahSheet.tsx`

Holat bo'yicha render:
```
past (completed) → arabcha matn, opacity: 0.5
active           → RecitationAyah (word tokens, full interaction)
upcoming         → arabcha matn, opacity: 0.15
```

---

## Step 12 — Continuous Mode Logic ✅

**Fayl:** `src/components/quran/ContinuousSurahSheet.tsx`

- `sessionStatus === 'finished'` → 500ms pauza → `reset()` → `setActiveIdx(next)` → `startSession(nextVerse)` + `start()`
- Mic to'xtamaydi, 100ms gap bilan keyingi oyat boshlanadi
- Active oyatga `scrollIntoView({ behavior: 'smooth', block: 'center' })`
- Sura oxiri: "Sura tugadi" message + ✅ icon
- `startVerseIndex`: FAB bosganda joriy oyatdan boshlanadi (`currentVerse` dan)

**FAB logikasi:**
```
Reader.tsx: FAB event → surah.verses barcha oyatlar +
  startIdx = findIndex(currentVerse) → openContinuousRecitation()
Layout.tsx: activeContinuousRecitation → ContinuousSurahSheet render
quranStore.ts: activeContinuousRecitation state + open/close actions
```

---

## ✅ Steps 1–12 + Real-time + Xato message + Tajweed fix + FAB continuous mode — Bajarildi

---

## Bug Fixes (✅ hammasi bajarildi)

### BF-1: Real-time ASR ✅
`interimResults: false` → `interimResults: true` + `processedWordsRef` pattern.
So'z tugagani zahoti (keyingisi boshlanishi bilanoq) check — 0ms kechikish.

### BF-2: Tajweed normalizatsiya ✅
`ٰ` (superscript alef, U+0670) → `ا` ga aylantirish `stripTashkeel` DAN OLDIN.
`الْعَٰلَمِينَ`, `الصِّرَٰطَ`, `الرَّحْمَٰنِ` hammasi endi match qiladi.
**Fayl:** `src/utils/arabicNormalize.ts`

### BF-3: Xato message ✅
`lastError: { recognized, expected }` store da. Controls ichida: qizil = aytilgan, ko'k = kutilgan.
**Fayl:** `src/stores/recitationStore.ts`, `src/components/quran/RecitationControls.tsx`

### BF-4: Xato so'z bloklamaydi ✅
`current.status === 'wrong'` guard olib tashlandi. Xato bo'lsa ham keyingi so'z aytilsa tekshiriladi.
`wasWrong` flag: xato allaqachon hisoblangan → errorCount oshmasin.
**Fayl:** `src/stores/recitationStore.ts`

### BF-5: FAB faqat Reader sahifasida ✅
`showMicFab = isReaderRoute && !zenMode && !activeRecitationVerse && !activeContinuousRecitation`
Scroll VA mushaf modda ham ko'rinadi. MushafView ning alohida FAB o'chirildi.
**Fayl:** `src/components/layout/Layout.tsx`, `src/components/quran/MushafView.tsx`

### BF-12: Mushaf FAB continuous mode ✅
MushafView ning alohida FAB `openRecitation` (single verse) chaqirar edi.
Tuzatish: MushafView FAB o'chirildi, Layout FAB mushaf modda ham ishlaydi.
Reader.tsx handler mushaf modda ham ishlaydi: birinchi sahifa oyatidan `surah.verses` ichida startIdx topadi.
**Fayl:** `src/pages/Reader.tsx`, `src/components/quran/MushafView.tsx`

### BF-6: Logout ✅
`mutateAsync()` exception → `navigate(ROUTES.LOGIN)` chaqirilmay qolardi. try/catch bilan tuzatildi.
**Fayl:** `src/pages/Profile.tsx`

### BF-7: 401 spam (unauthenticated queries) ✅
`useStreak`, `useMyAchievements`, `useGamificationDashboard`, `useBookmarks` → `enabled: isAuthenticated` guard qo'shildi.
**Fayl:** `src/api/gamification.ts`, `src/api/quran.ts`

### BF-8: Mushaf text overflow ✅
`overflow-hidden` → `overflow-y-auto` mushaf text container da.
**Fayl:** `src/components/quran/MushafPage.tsx`

### BF-9: Mushaf RTL swipe navigatsiya ✅
Swipe left = keyingi sahifa (→ raqam kamayadi, RTL to'g'ri).
Swipe right = oldingi sahifa. Klaviatura: ArrowLeft = next, ArrowRight = prev.
**Fayl:** `src/components/quran/MushafView.tsx`

### BF-10: Mushaf oyat tap ✅
Oyatga bosganda VerseActionSheet chiqadi: Play / Tafsir / Bookmark / Qiroat.
**Fayl:** `src/components/quran/MushafView.tsx`, `src/components/quran/VerseActionSheet.tsx`

---

## Keyingi Qadamlar

### BF-11: localStorage progress saqlash ✅

**Fayl:** `src/utils/recitationProgress.ts`
```ts
saveProgress(surahId: number, verseIdx: number): void
loadProgress(surahId: number): number | null
clearProgress(surahId: number): void
```
ContinuousControlBar har verse advance bo'lganda `saveProgress` chaqiradi.
FAB handler: `loadProgress(surahId)` ni tekshiradi, agar bor bo'lsa o'sha versedan boshlaydi.
Sura tugaganda yoki reset da `clearProgress` chaqiriladi.

---

## Step 13 — Display Mode: Reveal (Ko'rinmas matn) ✅

**Bajarildi:**
- `recitationStore.ts`: `displayMode: 'highlight' | 'reveal'` + `setDisplayMode()` action
- `WordToken.tsx`: reveal modda `dim`/`current` so'zlar `text-transparent` (joy saqlanadi, matn ko'rinmaydi). `current` da `underline decoration-accent` (cursor). `wrong` da `underline decoration-error-red` (xato pozitsiya ko'rinadi, matn emas). `correct` da to'liq ko'rinadi.
- `ContinuousControlBar.tsx`: 👁 toggle button (faqat idle holatda). Reveal yoqiq bo'lsa `EyeOff` ikonka ko'rsatiladi.
- Session boshlanganda `displayMode` reset QILINMAYDI — foydalanuvchi tanlagan mode saqlanadi.

**Konsept:** Oyat joylari bor, raqamlar bor, lekin matn oq/ko'rinmas. O'qilgan so'z o'sha joyda paydo bo'ladi.

**Farq MonkeyType modidan:**
| MonkeyType (mavjud) | Reveal (yangi) |
|---------------------|----------------|
| Matn dim ko'rinadi | Matn umuman ko'rinmaydi |
| O'qilganda yorqin | O'qilganda paydo bo'ladi |
| Hafiz uchun qiyin | Hifz sinovi uchun ideal |

**WordToken statuslari kengaytirish:**
```ts
export type WordStatus = 'dim' | 'current' | 'correct' | 'wrong' | 'hidden' | 'revealed'
```

**Yangi CSS:**
```
hidden   → color: transparent, user-select: none (joy saqlanadi, matn yo'q)
revealed → animate: fadeIn 300ms, color: var(--text-arabic)
```

**Fayllar:**
- `src/components/quran/WordToken.tsx` — `hidden`/`revealed` status
- `src/stores/recitationStore.ts` — `displayMode: 'highlight' | 'reveal'`
- `src/components/quran/ContinuousSurahSheet.tsx` — mode toggle UI

---

## Step 14 — Verse Finder (Qaysi oyat?) ✅

**Konsept:** Foydalanuvchi istalgan oyatni o'qiydi → tizim qaysi oyat ekanini aniqlaydi → foydalanuvchi o'sha joydan hifzini davom ettiradi.

### Algoritm

```ts
function findVerse(
  transcript: string,
  verses: { id: number; text_arabic: string }[]
): { verseId: number; score: number; matchedWords: number } | null
```

**Matching logikasi:**
1. `transcript` → `normalizeArabic` → so'zlarga split
2. Har bir verse uchun: sliding window — transcript so'zlari versedan topilsa score oshadi
3. Eng yuqori score > 0.6 threshold → found
4. Kamida 3 so'z mos kelishi kerak

**Bajarildi:**
- `src/utils/verseFinder.ts` — `findVerse()` sliding window algoritmi. Kamida 2 so'z mos kelishi kerak, score ≥ 0.5.
- `src/hooks/useVerseFinder.ts` — Web Speech API + `findVerse()` birlashtiradi. Real-time: har transcript yangilanishida verse qidiriladi.
- `src/components/quran/VerseFinderModal.tsx` — Modal UI: mic tugmasi → transcript ko'rinadi → match topilsa preview → "N-oyatdan boshlash" tugmasi.
- `src/components/quran/ContinuousControlBar.tsx` — 🔍 tugma modal ochadi. Modal onFound → `setContinuousActiveVerseIdx` + `startSession` + `start()`.

---

## Step 15 — Finder → Recitation integratsiyasi ✅

**Bajarildi:** VerseFinderModal `onFound(verseId)` → `ContinuousControlBar.handleVerseFound`:
1. `verses.findIndex(v => v.id === verseId)` → idx
2. `reset()` + `stop()` → `setContinuousActiveVerseIdx(idx)`
3. `startSession(verses[idx].text_arabic)` + `start()` + `scrollToVerse()`
4. Recitation o'sha versedan davom etadi

---

## ✅ Barcha Steps + BF-lar Tugadi

| Step | Fayl | Status |
|------|------|--------|
| 1–12 + BF-1..12 | — | ✅ |
| BF-11 | `src/utils/recitationProgress.ts` | ✅ |
| 13 | `WordToken.tsx`, `recitationStore.ts`, `ContinuousControlBar.tsx` | ✅ |
| 14 | `verseFinder.ts`, `VerseFinderModal.tsx`, `useVerseFinder.ts` | ✅ |
| 15 | `ContinuousControlBar.tsx` `handleVerseFound` | ✅ |
