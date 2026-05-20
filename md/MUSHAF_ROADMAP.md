# Mushaf View Roadmap

## Goal
Kitob ko'rinishidagi Mushaf: katta ekranda 2 sahifa yonma-yon, kichikda 1 sahifa, fullscreen tugmasi.

---

## Step 1 — Dual-page layout (MushafView)

**Fayl:** `muslihun/src/components/quran/MushafView.tsx`

- Desktop (≥ 768px): ikkita sahifa yonma-yon (`flex-row`)
  - O'ng: toq sahifa (odd) — Qur'onda o'ng tomonda
  - Chap: juft sahifa (even) — Qur'onda chap tomonda
  - Sahifa 1 — yolg'iz o'ng tomonda (fotiha)
  - Navigatsiya 2 ta o'tadi (±2)
- Mobile (< 768px): bitta sahifa (mavjud ko'rinish)
- `usePage` ikki sahifani alohida fetch qiladi (prefetch bor)
- `useMediaQuery('(min-width: 768px)')` yoki Tailwind `md:` breakpoint

**Yangi hook:** `useIsDualPage()` — `window.innerWidth >= 768`

---

## Step 2 — Single page component `MushafPage`

**Yangi fayl:** `muslihun/src/components/quran/MushafPage.tsx`

`MushafView` dan bir sahifa ko'rsatuvchi qism ajraladi:
- Dekorativ chegara (ornamental border — rasmga mos)
- Surah nomi header (faqat surah boshlangan sahifada)
- Oqayotgan arab matni + oyat raqamlari (﴿١﴾)
- Sahifa raqami pastda markazda
- Juz/hizb ko'rsatuvchi meta (surah yonida)

---

## Step 3 — Book gutter & visual polish

- Ikki sahifa orasida kitob "muqovasi" effekti (vertikal divider + shadow)
- Har bir sahifada ornamental border (SVG yoki CSS — rasmga mos yashil/oltin)
- Sahifa foni: `#FEFDF8` (light) / `#1a1208` (dark)
- Surah header: dekorativ ramka ichida arabcha nom + transliteratsiya + oyat soni

---

## Step 4 — Fullscreen mode

**Fayl:** `muslihun/src/pages/Reader.tsx` + `MushafView.tsx`

- `MushafView` ichida fullscreen tugmasi (o'ng yuqori burchak)
  - Icon: `Maximize2` (Lucide)
- Fullscreen bosqich:
  - Header, navbar, sidebar — yashirinadi (`zenMode` kabi)
  - Faqat `MushafView` + chiqish tugmasi ko'rinadi
  - `X` (Lucide `X`) — chap yuqori burchak, fullscreen dan chiqish
- State: `isMushafFullscreen` — `quranStore` ga qo'shiladi yoki local state
- Keyboard: `Escape` → fullscreen dan chiqish
- Swipe (mobile): chapga/o'ngga swipe → sahifa o'tish

---

## Step 5 — Navigation UX

- Keyboard: `←` `→` strelka — sahifa o'tish (fullscreen da)
- Sahifa raqamiga bosib kirish (input popup)
- Surah jump: dropdown yoki modal

---

## Files to touch

| Fayl | O'zgarish |
|------|-----------|
| `src/components/quran/MushafView.tsx` | Dual-page + fullscreen trigger |
| `src/components/quran/MushafPage.tsx` | **YANGI** — bir sahifa komponenti |
| `src/stores/quranStore.ts` | `mushafFullscreen: boolean` state |
| `src/pages/Reader.tsx` | Fullscreen wrapper logic |
| `src/index.css` | Mushaf sahifa CSS custom properties |

---

## Order of implementation

1. `MushafPage` komponenti (ajratilgan bir sahifa)
2. `MushafView` dual-page layout (desktop/mobile)
3. Fullscreen state + UI
4. Visual polish (borders, shadows, gutter)
5. Navigation UX (keyboard, swipe)
