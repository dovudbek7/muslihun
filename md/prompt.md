# Muslihun — Figma Design Prompt

## Overview

Design a **complete mobile-first Islamic app** called **Muslihun** — a Quran reading, memorization, and daily practice companion. The design must be **minimalist, premium, and spiritually calming**. Think: the intersection of a luxury reading app (like Readwise or Matter) and an Islamic aesthetic. No clutter. Every element must earn its place.

Primary target: iOS/Android phones. Secondary: tablet + desktop (sidebar layout).

---

## Design Language

### Aesthetic Direction
- **Minimalist Islamic** — clean geometry, subtle Arabic calligraphy as decoration (not noise)
- **Calm and focused** — no aggressive colors, no busy patterns
- **Premium feel** — generous whitespace, refined typography, smooth transitions
- **Dark-first** — primary experience in dark theme (deep backgrounds, warm accents)

### Typography
- **Arabic text:** Scheherazade New or Amiri — large, flowing, beautiful
- **Latin UI text:** Inter or SF Pro — clean, legible, modern
- **Arabic numbers:** Eastern Arabic numerals (٠١٢٣٤٥٦٧٨٩) for verse markers
- **Size scale:** Arabic body text 22–28px, UI labels 12–15px, verse number badges 10–11px

### Spacing & Layout
- Mobile content max-width: 430px
- Desktop content column: max 720px, centered with sidebar
- Base spacing unit: 4px grid
- Card border-radius: 16–24px
- Generous padding: 16–20px horizontal on mobile

---

## Color Themes (all 3 required)

### Theme 1: Dark (Primary / Islamic Night)
```
Background primary:    #0D0D0D
Background secondary:  #141414
Background elevated:   #1C1C1E
Background card:       #1C1C1E
Accent:                #C9A84C  (warm gold)
Text primary:          #F2F2F7
Text secondary:        #AEAEB2
Text muted:            #636366
Text arabic:           #E8D5A0  (warm off-white for Arabic)
Border subtle:         rgba(255,255,255,0.08)
Border:                rgba(255,255,255,0.14)
Shadow:                rgba(0,0,0,0.5)
```

### Theme 2: Light (Parchment Day)
```
Background primary:    #FAFAF8
Background secondary:  #F5F3EF
Background elevated:   #FFFFFF
Background card:       #FFFFFF
Accent:                #7C5A2A  (deep amber)
Text primary:          #1C1C1E
Text secondary:        #48484A
Text muted:            #8E8E93
Text arabic:           #2C1A0A
Border subtle:         rgba(0,0,0,0.06)
Border:                rgba(0,0,0,0.12)
```

### Theme 3: Gray (Neutral Slate)
```
Background primary:    #18181B
Background secondary:  #27272A
Background elevated:   #3F3F46
Background card:       #27272A
Accent:                #A78BFA  (soft violet)
Text primary:          #FAFAFA
Text secondary:        #D4D4D8
Text muted:            #71717A
Text arabic:           #E4D9F7
Border subtle:         rgba(255,255,255,0.06)
Border:                rgba(255,255,255,0.10)
```

---

## Screens to Design

### 1. HOME PAGE

**Layout structure (top to bottom):**

**A. Prayer Times Widget (top, full-width)**
- Full-width hero section, sky-gradient background that changes by time of day:
  - Fajr: deep indigo-purple `#1a0533`
  - Dhuhr: warm sky blue `#1a3d5c`
  - Asr: amber-orange `#3d2000`
  - Maghrib: deep crimson `#2d0a1a`
  - Night: deep black-blue `#050b1a`
- Content layout:
  - Top row: city name (left) + notification bell icon (right)
  - Hijri date in Arabic script (small, below city)
  - Center: next prayer countdown — large bold time like `00:16:09` remaining
  - Below: arc/timeline with 6 prayer dots (Fajr · Sunrise · Dhuhr · Asr · Maghrib · Isha)
    - Active prayer: filled gold circle with glow
    - Past prayers: small filled dots
    - Future prayers: hollow dots
    - Connected by a thin line
  - Prayer names + times below each dot
- Collapse behavior: as user scrolls down, this widget shrinks to a slim status bar showing only current prayer name + time

**B. Content Card (overlaps widget with rounded top corners)**
- Rounded top: 28px radius, white card slides over the prayer widget
- Drag handle indicator at top center

**C. Greeting Row**
- Left: "Assalamu alaykum" (small muted) + User name (bold, larger)
- Right: streak badge — flame icon + number, amber/orange pill design

**D. Feature Grid (2×2 or 3 columns on wider screens)**
- 4-5 feature tiles in a grid:
  - Qur'on (emerald green gradient)
  - Hifz (blue gradient)
  - Tasbih (purple gradient)
  - Qidiruv/Search (amber gradient)
  - Qibla (teal gradient)
- Each tile: icon (26px) + label, gradient background, subtle border, rounded 20px
- Tap scale-down micro-animation on press

**E. Continue Reading Card**
- Full-width card with accent gradient (gold/green)
- "O'qishni davom ettirish" label
- Current surah name (large, bold) + Arabic name
- Current position: "Surah:Verse"
- Right: arrow circle button

**F. Surah List (recent, 10 items)**
- Section header: "Suralar" + "Barchasi →" link
- Each row: number badge + transliteration name + verse count + Arabic name + play button
- Subtle dividers or card style

---

### 2. SURAH LIST PAGE

Full list of all 114 surahs.

**Header:**
- Back button + "Barcha suralar" title
- Search bar (search within surahs)

**List:**
- Each surah row (card or row with divider):
  - Number badge (square, 32×32, rounded corners)
  - Name (transliteration, bold) + verse count (muted)
  - Arabic name (right aligned, large)
  - Play button + Microphone button (icon buttons, right side)
- On desktop/tablet: 2-column grid

---

### 3. QURAN READER — SCROLL MODE (VerseCard style)

Standard verse-by-verse reading with translations.

**Sticky Header Bar (below TopNav):**
- Left: surah name (transliteration) + Arabic name
- Right: play surah button + settings gear

**Content area:**
- Bismillah ornament at top (centered, decorative lines each side)
- Each verse as a card:
  - Top row: verse number circle (left) + action icons (play, tafsir/book, bookmark, mic) right
  - Arabic text: large, RTL, flowing (22–26px), right-aligned
  - Transliteration line (if enabled): italic, muted, smaller
  - Translation text: below, left-aligned, secondary color, separated by thin border
  - Active/playing verse: accent border glow + subtle accent background tint
  - Playing indicator: thin accent line animating across bottom of card
  
**Floating FAB:**
- Bottom-right: microphone button, circular, accent color, shadow

---

### 4. QURAN READER — VERTICAL MODE (Quran Majeed Style)

Continuous flowing Arabic text, immersive reading.

**Full background:** Very dark, almost black (warm black `#0f0a05`)

**Surah header (ornamental):**
- Decorative horizontal lines with diamond ornament (❖) on each side
- Gold-bordered box with inner dark background
- "سُورَةُ [Surah Name]" in gold Arabic calligraphy
- Surah transliteration + verse count below in smaller text

**Bismillah:** centered, warm off-white, slightly larger

**Continuous text area:**
- Arabic text flows continuously RTL, line height 3.0–3.2
- Color: warm parchment white `#F5EDD0`
- Verse end markers: ﴿٣﴾ style, gold color, slightly smaller
- Tap a verse span: highlights in amber `#FCD34D`
- Very subtle background texture optional (noise grain overlay at 3% opacity)

---

### 5. QURAN READER — MUSHAF (Page-by-Page) MODE

Book-style mushaf pages.

**Mobile (single page):**
- Full-height page with parchment/cream background `#F5EDD0`
- Double border frame (outer thick, inner thin, both in aged gold `rgba(139,90,20,0.45)`)
- Corner ornaments: ✦ at each corner in gold
- Top header (inside frame): surah name (right, Arabic) + juz number (left, Arabic)
- Ornamental wave/scroll line below header
- Surah banner (when surah starts on this page): decorative gold-bordered header box
- Bismillah (when applicable): centered, same style as page text
- Arabic text: continuous flow RTL, black on parchment `#2C1A0A`
- Verse number markers: ۞٣ style, gold color, inline
- Bottom: ornamental wave line + page number in Arabic numerals (gold)
- Page navigation: swipe left/right (no visible buttons)

**Tablet/Desktop (dual page spread):**
- Two pages side-by-side with book spine shadow in center
- Left page = higher page number (Arabic left side)
- Right page = lower page number (Arabic right side)
- Matching frame and ornaments on both pages

**Mode switcher (top right, 3 icons):**
- ↕ (vertical scroll mode)
- 📖 (page mode) — active state
- 🔍 (zoom mode)
- Fullscreen expand icon
- Compact, pill-style group or individual icon buttons

---

### 6. QURAN READER — ZOOM MODE

Same as mushaf page but with pinch-to-zoom gesture support.

- Single page only (no dual page in zoom mode)
- Zoom indicator: "185%" pill badge (bottom right corner, subtle)
- Double-tap → reset to 1x zoom
- Current page indicator at bottom

---

### 7. SEARCH PAGE

**Search bar (prominent, top):**
- Large rounded input, prominent placeholder: "Oyat, surah, so'z qidirish..."
- Search icon left, clear button right
- Supports Arabic, transliteration, and translation search

**Results:**
- Section label: "Natijalar" + count badge
- Each result card:
  - Arabic text (highlighted matching portion)
  - Translation excerpt below (highlighted)
  - Right badge: "Surah X : Verse Y"
  - Tap → navigate to that verse in reader

**Empty state:**
- Centered illustration placeholder + "Qidiruv natijasi yo'q" text

---

### 8. HIFZ (MEMORIZATION) PAGE

Spaced repetition memorization system.

**Tab bar (4 tabs):**
- Takror (Review) — with count badge (due verses)
- Suralar (Surahs)
- Xatolar (Errors) — with count badge
- Statistika (Stats)

**Review Tab:**
- Due verse count headline: "Bugun X oyat takrorlash kerak"
- Verse card (flash card style):
  - Arabic text (large, centered, RTL)
  - Show/Hide translation toggle button
  - Audio play button
  - Rating buttons row: "Unutdim" (red) | "Qiyin" (yellow) | "Bilaman" (green)
- Progress bar showing session progress
- Empty state: "Barcha oyatlar takrorlandi ✓" with celebration

**Surahs Tab:**
- Surah list with progress bar per surah
- "Boshlash" or "Davom ettirish" button per surah
- Progress: X/Y verses memorized

**Errors Tab:**
- 2 sub-sections: 🔴 Qizil xatolar / 🟡 Sariq xatolar
- Each error: verse excerpt + error count + "Mashq" button

**Stats Tab:**
- Summary cards: total memorized / streak / accuracy %
- Weekly bar chart (7 days)
- Heatmap calendar (GitHub contribution style)

---

### 9. RECITATION (QIROAT) PAGE

Voice recording and recitation practice.

**Surah selector at top**

**Mode toggle:**
- "Mashq" (Practice) | "Tekshirish" (Check)
- Pill toggle switcher

**Verse display:**
- Large Arabic text, RTL
- In Check mode: word-level color coding:
  - Correct words: normal or green tint
  - Wrong words: red highlight
  - Current word: gold underline

**Control bar (bottom):**
- Microphone button (large, center) — pulse animation when recording
- Waveform visualization when recording
- Previous / Next verse buttons
- Recording timer

---

### 10. TASBIH (DHIKR COUNTER) PAGE

**Counter display:**
- Giant number (counter) — centered, very large (80–100px)
- Circular progress ring behind the number (shows progress toward target, e.g., 33/100)
- Current dhikr name in Arabic (large, RTL, below number)
- Transliteration below

**Controls:**
- Large tap area (full bottom half of screen) — tap to count
- Haptic feedback on each tap (visual ripple animation)
- Reset button (small, top right)
- Target selector: 33 / 99 / 1000 / custom

**Dhikr selector:**
- Horizontal scrollable chips at top: SubhanAllah | Alhamdulillah | AllahuAkbar | Istighfar | Salawat | …
- Custom dhikr option

**Progress indicator:**
- "X marta aytildi" below counter

---

### 11. QIBLA FINDER PAGE

**Compass:**
- Full-screen or hero-sized animated compass
- Rotating needle pointing toward Mecca (Kaaba illustration at center or North marker)
- Degree indicator: "Qibla: 247°" at top
- Distance: "Makkadan masofa: 3,456 km" at bottom
- Background: subtle dark gradient with geometric Islamic pattern overlay (very faint)
- Permission request state: clean dialog asking for location access

---

### 12. PROFILE PAGE

**Header:**
- Avatar circle (initials if no photo)
- Username + email
- "Logout" text button (top right)

**Stats row (3 cards horizontal):**
- Current streak 🔥
- Total verses read
- Total memorized

**Achievements section:**
- Grid of achievement badges (locked = grayscale, unlocked = full color + glow)
- Each badge: icon + name + description on tap

**Settings section:**
- Theme picker: 3 swatches (Dark / Light / Gray) — selected has ring
- Language picker: EN / RU / TR / UZ
- Font size slider: Arabic text size preview
- Toggles: Show Transliteration / Show Translation / Arabic Only / Zen Mode

---

### 13. SETTINGS DRAWER (slide-in panel)

Slides from the right side.

**Sections:**
- Reading Mode: Scroll | Mushaf (tab toggle)
- Mushaf Mode (if Mushaf selected): Vertical | Page | Zoom (3 icon buttons)
- Theme: Dark | Light | Gray (3 labeled swatches with preview dot)
- Language: EN / RU / TR / UZ Lat / UZ Cyr (pill select)
- Arabic Font Size: slider with live Arabic preview ("بِسْمِ ٱللَّهِ")
- Toggles:
  - Transliteration (on/off)
  - Arabic Only (on/off)
  - Inline Tafsir (on/off)
  - Zen Mode (on/off)
- Reciter: selector with name + flag

---

### 14. AUDIO PLAYER BAR (persistent bottom bar)

Appears at bottom when audio is playing, replaces BottomNav.

**Layout:**
- Left: surah name + verse info
- Center: play/pause button (large)
- Right: skip forward, speed, close
- Top: thin progress bar (accent color)
- Background: slightly elevated card, blur effect

---

### 15. NAVIGATION

**Mobile (< 1024px): Bottom Tab Bar**
- 5 tabs: Qur'on (book) | Qidiruv (search) | Hifz (brain) | Qiroat (mic) | Profil (user)
- Active tab: accent color icon + bg pill
- Inactive: muted icon

**Desktop (≥ 1024px): Left Sidebar**
- Width: 240px (with labels) or 72px (icon-only on lg without xl)
- App logo/name at top: Arabic "مسلم" + "Muslihun" text
- Same 5 nav items as bottom bar + Settings button at bottom
- Active: accent bg pill full width
- Right: main content column (max 720px, centered)

---

## Key Component Designs

### Verse Number Badge
- Circle, 28×28px
- Playing: filled accent background, white number
- Default: elevated background, muted number, subtle border

### Action Icon Button
- 32×32px rounded square
- Active (bookmarked/playing): filled accent background
- Hover/default: transparent, muted icon

### Surah Name Badge (in navigation pills)
- Pill shape, small (32px height)
- Elevated background, subtle border
- Icon (12px) + label text

### Loading Skeleton
- Animated shimmer (left-to-right gradient sweep)
- Card shape matching content

### Toast / Notification
- Bottom center, auto-dismiss
- Dark pill with white text + icon

### Bottom Sheet / Drawer
- Drag handle at top
- Smooth slide-up animation
- Backdrop blur overlay

---

## Interaction & Animation Notes

- **Page transitions:** horizontal slide (like native mobile navigation)
- **Cards:** subtle scale on tap (0.97x), spring physics
- **Prayer widget collapse:** smooth height transition + fade crossfade to status bar
- **Audio player appear:** slide up from bottom, spring
- **Mushaf page turn:** swipe gesture, no flip animation (instant or fade)
- **Streak badge:** small bounce animation on first load
- **Microphone button:** pulsing ring animation when recording
- **Counter (Tasbih):** ripple expand animation on each tap

---

## Screen Sizes to Design For

1. **iPhone 15 Pro** (393×852px) — primary mobile
2. **iPhone SE** (375×667px) — small phone
3. **iPad Mini** (744×1133px) — tablet, dual-page mushaf
4. **Desktop** (1440×900px) — sidebar layout

---

## What NOT to do

- No heavy Islamic geometric patterns covering full backgrounds (subtle only)
- No green + white "Islamic flag" color scheme — this is premium, not generic
- No skeuomorphic book textures on anything except the Mushaf page view
- No animations that delay content by more than 200ms
- No more than 3 colors in any single screen (accent + text + background)
- No floating action buttons that block content

---

## Deliverables Expected from Figma

1. Component library (colors, typography, icons, atoms)
2. All 15 screens in Dark theme (complete)
3. All 15 screens in Light theme (complete)
4. All 15 screens in Gray theme (complete)
5. Key interaction flows as prototypes:
   - Prayer widget collapse on scroll
   - Verse card tap + audio play
   - Mushaf swipe navigation
   - Tasbih counter tap
6. Desktop layout versions for Home, Reader, and Hifz

---

*App: Muslihun — Quran learning & worship companion*
*Stack: React + Tailwind CSS + Zustand + Framer Motion*
*Existing themes: Dark / Light / Gray via CSS custom properties*
