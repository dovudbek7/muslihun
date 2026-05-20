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

## Step 1 — Arabcha Normalizatsiya Utils

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

## Step 2 — RecitationStore (Zustand)

**Fayl:** `src/stores/recitationStore.ts`

State:
```ts
status: 'idle' | 'listening' | 'paused' | 'finished'
words: WordState[]          // { text, status: 'dim'|'correct'|'wrong'|'current' }
currentWordIndex: number
transcript: string          // last recognized word
errorCount: number
correctCount: number
```

Actions:
```ts
startSession(ayah: string)
processWord(recognizedWord: string)
nextWord()
reset()
pause() / resume()
```

---

## Step 3 — Web Speech API Hook

**Fayl:** `src/hooks/useRecitation.ts`

- `SpeechRecognition` init (Arabic: `lang='ar-SA'`)
- `continuous: true`, `interimResults: true`
- `onresult` → extract last word → `recitationStore.processWord()`
- `onend` → auto-restart agar status `listening`
- Mikrofon permission handling
- Return: `{ isListening, start, stop, error }`

---

## Step 4 — WordToken Component

**Fayl:** `src/components/quran/WordToken.tsx`

```
dim     → opacity: 0.3, color: var(--text-muted)
current → opacity: 1.0, underline yoki glow, color: var(--text-primary)
correct → opacity: 1.0, color: var(--color-success) yoki default bright
wrong   → opacity: 1.0, color: var(--color-error), fade-out 2s → dim
```

Props: `{ word: string, status: WordStatus, isRTL: true }`

Animatsiya: CSS transition `color 300ms ease`, `opacity 300ms ease`

---

## Step 5 — RecitationAyah Component

**Fayl:** `src/components/quran/RecitationAyah.tsx`

- Ayah textini `splitWords()` → `WordToken[]` array
- `recitationStore` dan status o'qish
- RTL flex-wrap layout
- Joriy so'z (currentWordIndex) scroll-into-view
- Props: `{ surahId, ayahNumber, arabicText }`

---

## Step 6 — RecitationControls Component

**Fayl:** `src/components/quran/RecitationControls.tsx`

UI elementlari:
- **[Boshlash]** tugmasi → `startSession()` + `start()` mic
- **[To'xtatish / Davom]** toggle
- **[Qayta]** reset
- Mikrofon indicator (animatsiyali pulsing dot)
- Progress: `correctCount / totalWords`
- Error counter

---

## Step 7 — RecitationPage yoki Modal

**Variant A:** Yangi sahifa `src/pages/Recitation.tsx`
- Route: `/recite/:surahId` yoki `/recite/:surahId/:ayahFrom/:ayahTo`
- Sura tanlash dropdown / range selector

**Variant B:** Reader ichida modal/panel
- `VerseCard` da "Mashq" tugmasi → modal ochiladi
- Ayah o'sha yerda recitation modega o'tadi

**Tavsiya: Variant A** — alohida sahifa, full-screen, concentration muhim

---

## Step 8 — Navigatsiya + Routing

**Fayl:** `src/App.tsx`

```tsx
<Route path="/recite/:surahId" element={<Recitation />} />
```

**Fayl:** `src/components/navigation/...`
- Sura sahifasida "Qiroat Mashqi" link/button qo'shish

---

## Step 9 — Progress & Session Stats

**Keyin** (basic version ishlagandan so'ng):
- Session tugaganda natija: `X/Y so'z to'g'ri, Z xato`
- Backend ga log yuborish (optional, offline ham ishlaydi)
- Sura/ayah range bo'yicha progress localStorage da saqlash

---

## ✅ Steps 1–8 — Bajarildi

---

## Mode Tizimi — 2 xil rejim

### Mode A: Verse-by-Verse (✅ bajarildi)
Har bir oyat alohida. Boshlash → o'qi → tugadi overlay → "Keyingi oyat" tugmasi.

### Mode B: Continuous (keyingi step)
Barcha oyatlar bir ekranda. Hamma dim. O'qigan sari oyat-oyat yorqinlashib boradi. Avto-o'tish.

---

## Step 10 — Mode Selector UI

**Fayl:** `src/pages/Recitation.tsx`

- Header ostiga tab/toggle: `[Oyat | Uzluksiz]`
- `mode: 'single' | 'continuous'` state
- Mode o'zgartirganda `reset()` + `stop()`

---

## Step 11 — ContinuousVerse Component

**Fayl:** `src/components/quran/ContinuousVerse.tsx`

Holat bo'yicha render:
```
completed  → barcha so'z yorqin (text-text-arabic, opacity 1)
active     → RecitationAyah (word tokens)
upcoming   → arabcha matn, opacity 0.2
```

Props: `{ verse, status: 'completed'|'active'|'upcoming', verseNumber }`

---

## Step 12 — Continuous Mode Logic

**Fayl:** `src/pages/Recitation.tsx`

- `sessionStatus === 'finished'` detect → 600ms pauza → `startSession(nextVerse)` (mic to'xtamaydi)
- `useEffect([sessionStatus])` → auto-advance
- Scroll: active oyatga `scrollIntoView` trigger
- Suraning barcha oyatlarini render — active verse `RecitationAyah`, qolganlari `ContinuousVerse`
- Sura tugasa → "Sura tugadi" modal

---

## Tartib va Muddatlar

| Step | Fayl | Taxminiy |
|------|------|----------|
| 1–8 | — | ✅ |
| 10 | `Recitation.tsx` mode toggle | 20 min |
| 11 | `ContinuousVerse.tsx` | 30 min |
| 12 | Auto-advance logic | 45 min |

**Jami: ~1.5 soat** Mode B uchun

---

## Texnik Eslatmalar

- Web Speech API faqat **HTTPS** da ishlaydi (localhost OK)
- Chrome eng yaxshi Arabic ASR. Firefox — cheklangan
- Harakat stripping sababli `بِسْمِ` va `بسم` bir xil hisoblanadi
- `wrong` status: 2 soniya qizil, keyin `dim` ga qaytadi — foydalanuvchi davom etishi uchun
- Sura oxiriga yetganda `status: finished` → stats ko'rsatish

---

## Keyingi Qadamlar

1. Step 1 dan boshlash (`arabicNormalize.ts`)
2. Browser console'da speech recognition test qilish
3. MVP ishlasa — tajweed highlight bilan bog'lash (Feature #9 dan)

---

## ✅ Steps 1–12 + Real-time + Xato message + Tajweed fix — Bajarildi

---

## Bug Fixes (✅ bajarildi)

### BF-1: Real-time ASR (✅)
`interimResults: false` → `interimResults: true` + `processedWordsRef` pattern.
So'z tugagani zahoti (keyingisi boshlanishi bilanoq) check — 0ms kechikish.

### BF-2: Tajweed normalizatsiya (✅)
`ٰ` (superscript alef, U+0670) → `ا` ga aylantirish `stripTashkeel` DAN OLDIN.
`الْعَٰلَمِينَ`, `الصِّرَٰطَ`, `الرَّحْمَٰنِ` hammasi endi match qiladi.

### BF-3: Xato message (✅)
`lastError: { recognized, expected }` store da. Controls ichida: qizil = aytilgan, ko'k = kutilgan.

---

## BF-4 — Xato so'z bloklamaydi (❌ hali)

**Muammo:** `recitationStore.ts` line 53:
```ts
if (!current || current.status === 'wrong') return  // ← bu blok!
```
Xato so'z aytilganda 1.5s davomida yangi so'z qabul qilinmaydi.

**Yechim:** Guard'ni olib tashla. Xato holatida ham processWord ishlaydi:
- To'g'ri aytsa → `correct`, index oldinga
- Yana xato → `wrong` yangilanadi, errorCount oshmasin (allaqachon oshgan)

```ts
processWord: (recognized) => {
  const { words, currentIndex, correctCount, errorCount } = get()
  if (!words.length) return
  const current = words[currentIndex]
  if (!current) return  // faqat shu qoladi

  const newWords = [...words]
  const wasWrong = current.status === 'wrong'

  if (wordsMatch(recognized, current.text)) {
    newWords[currentIndex] = { ...current, status: 'correct' }
    const next = currentIndex + 1
    if (next >= words.length) {
      set({ words: newWords, currentIndex: next, correctCount: correctCount + 1, sessionStatus: 'finished', lastError: null })
    } else {
      newWords[next] = { ...newWords[next], status: 'current' }
      set({ words: newWords, currentIndex: next, correctCount: correctCount + 1, lastError: null })
    }
  } else {
    newWords[currentIndex] = { ...current, status: 'wrong' }
    // wasWrong bo'lsa errorCount oshmasin (allaqachon hisoblangan)
    set({ words: newWords, errorCount: wasWrong ? errorCount : errorCount + 1, lastError: { recognized, expected: current.text } })
  }
}
```
`setTimeout` olib tashlanadi — xato qizil qoladi, foydalanuvchi to'g'rilaguncha.

---

## BF-5 — Uzluksiz rejimda oqish davomiyligini saqlash (❌ hali)

**Muammo:** Uzluksiz modeda oyat tugab keyingisi boshlanayotganda `startSession` chaqiriladi va `currentIndex: 0` reset bo'ladi. Foydalanuvchi to'xtatib qaytsa — o'sha joydan davom etolmaydi.

**Yechim:** `localStorage` da `{ surahId, verseIdx, wordIdx }` saqlash:
- Har `processWord` → `correct` bo'lganda localStorage yangilash
- Sahifa ochilganda: oxirgi joyni tiklash
- "Qolgan joydan davom" tugmasi

**Fayl:** `src/utils/recitationProgress.ts` (yangi)
```ts
saveProgress(surahId: number, verseIdx: number, wordIdx: number): void
loadProgress(surahId: number): { verseIdx: number; wordIdx: number } | null
clearProgress(surahId: number): void
```

---

## Step 13 — Display Mode: Reveal (Ko'rinmas matn)

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

**DisplayMode:**
```ts
type DisplayMode = 'highlight' | 'reveal'
```

**Fayl:** `src/pages/Recitation.tsx` — display mode toggle qo'shish
**Fayl:** `src/components/quran/WordToken.tsx` — `hidden`/`revealed` status qo'shish
**Fayl:** `src/stores/recitationStore.ts` — `displayMode` state yoki prop

**startSession** `displayMode === 'reveal'` bo'lsa barcha so'z statusini `hidden` dan boshlaydi, birinchi so'z `current` (cursor sifatida underline ko'rinadi).

Xato so'z: `hidden` qolishi mumkin yoki qizil outline chiqarish.

---

## Step 14 — Verse Finder (Qaysi oyat?)

**Konsept:** Foydalanuvchi istalgan oyatni o'qiydi → tizim qaysi oyat ekanini aniqlaydi → foydalanuvchi o'sha joydan hifzini davom ettiradi.

### Arxitektura

```
Mic → ASR transcript → normalizeArabic() →
  → compareWithVerses() → best match → navigate to verse
```

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
3. Eng yuqori score > threshold (masalan 0.6) → found
4. Kamida 3 so'z mos kelishi kerak (false positive kamaytirish)

**Sliding window misol:**
```
transcript: ["الله", "الرحمن", "الرحيم"]
verse 1:1:  ["بسم", "الله", "الرحمن", "الرحيم"] → 3/3 match → score: 1.0 ✅
verse 2:3:  ["الذين", "يؤمنون"] → 0 match → score: 0.0 ❌
```

### UI Flow

```
[Oyat topish] tugmasi → modal ochiladi
  → "Istalgan oyatni o'qing..." placeholder
  → Mic yonadi → foydalanuvchi 5-10 so'z o'qiydi
  → Real-time: so'zlar kirishi bilanoq qidiruv boshlanadi
  → Topildi: "Al-Fatiha, 1-oyat" + preview
  → [O'sha joydan boshlash] tugmasi → navigate
```

### Fayllar

| Fayl | Vazifa |
|------|--------|
| `src/utils/verseFinder.ts` | `findVerse()` algoritmi |
| `src/components/quran/VerseFinderModal.tsx` | Modal UI |
| `src/hooks/useVerseFinder.ts` | ASR + findVerse birlashtirish |
| `src/pages/Recitation.tsx` | Modal trigger qo'shish |

### Mavjud qayta ishlatiluvchi funksiyalar

- `normalizeArabic()` — `src/utils/arabicNormalize.ts` (tayyor)
- `splitWords()` — `src/utils/arabicNormalize.ts` (tayyor)
- `wordsMatch()` — `src/utils/arabicNormalize.ts` (tayyor)
- `useRecitation` hook — ASR logikasi (qayta ishlatish mumkin yoki alohida hook)
- `useSurah()` — verse data olish (tayyor)

### Texnik nuance

- Sura ma'lumoti `useSurah(surahNumber)` dan keladi — Verse Finder modali ochilganda qaysi sura ekanini bilish kerak
- Yoki global qidiruv: barcha 6236 oyat — bu og'ir, backend da qidirish yaxshiroq
- **Tavsiya:** Hozircha faqat joriy sura ichida qidirish (foydalanuvchi sura sahifasidan kiradi)

---

## Step 15 — Finder → Hifz integratsiyasi

**Verse Finder** topgan oyatdan:
1. `navigate('/hifz/review/:surahId/:verseId')` — hifz review modiga o'tish
2. Yoki: finder modal yopiladi, recitation o'sha versedan boshlanadi
3. `saveProgress(surahId, verseIdx, 0)` — progress saqlash

---

## Yangilangan Tartib

| Step | Fayl | Status |
|------|------|--------|
| 1–12 + BF-1,2,3 | — | ✅ |
| BF-4 | `recitationStore.ts` | ❌ |
| BF-5 | `recitationProgress.ts` | ❌ |
| 13 | `WordToken.tsx`, `Recitation.tsx` | ❌ |
| 14 | `verseFinder.ts`, `VerseFinderModal.tsx`, `useVerseFinder.ts` | ❌ |
| 15 | `Recitation.tsx` + hifz nav | ❌ |
