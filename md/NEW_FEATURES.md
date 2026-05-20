# Muslihun — 15 Yangi Feature Tavsiyalari

---

## 1. ✅ Speech-to-Text Hifz (Whisper AI)
Mikrofonga oyat o'qilsa, Whisper ASR model arabcha nutqni tanib, foydalanuvchi o'qigan oyatni backend oyati bilan taqqoslaydi. To'g'ri → yashil, xato → qizil highlight. WebSocket orqali real-time.
**Stack:** OpenAI Whisper (fine-tuned Arabic) + Django Channels WebSocket + React `MediaRecorder` API.

---

## 2. ✅ Hifz Dashboard & Statistics
Haftalik/oylik progress grafiklar: qancha oyat yodlandi, SM-2 intervallari, streak heatmap (GitHub contribution graph uslubida), eng kuchli va eng zaif sura reytingi.
**Stack:** Chart.js yoki Recharts, backend `HifzProgress` aggregation API.

---

## 3. 🔔 Push Notifications — Kunlik Takror Eslatma
Har kuni belgilangan vaqtda: "Bugun 12 ta oyat takror qilish kerak" push bildirishnomasi. Foydalanuvchi vaqtni o'zi sozlaydi.
**Stack:** Django Celery Beat + Web Push (VAPID keys) + Service Worker `push` event.

---

## 4. 🌙 Ramadan Mode
Ramazon oyida maxsus rejim: sahur/iftor vaqt hisoblagichi, har kuni bir juz o'qish maqsadi, 30 kunlik progress tracker, teravih namozi vaqtlari.
**Stack:** Aladhan API Ramadan calendar + frontend special UI overlay.

---

## 5. 👨‍👩‍👧 Oilaviy / Guruh Hifz
Bir ustoz bir nechta o'quvchiga sura belgilaydi, o'quvchilar progress ustoz paneliga tushadi. Guruh streak, jamoa reytingi.
**Stack:** Django Group model, role-based permissions (teacher/student), shared HifzProgress view.

---

## 6. 📖 Word-by-Word (Kalima-Kalima) Tarjima
Har bir arabcha so'z ustiga bosganda — o'sha so'zning tarjimasi, grammatik roli (ism/fe'l/harf), ildizi ko'rinadi. Lug'at rejimi.
**Stack:** `quran.com` word-by-word dataset (JSON) yoki `tanzil.net` DB, frontend tooltip/popover.

---

## 7. 🎯 Murojaat Qidirish (Verse Search by Meaning)
Foydalanuvchi o'zbek/rus/inglizcha ma'no yozadi, semantik qidiruv oyatlar topib beradi. Masalan: "sabr" deb yozsа — sabr haqidagi oyatlar.
**Stack:** `sentence-transformers` embedding + pgvector PostgreSQL yoki Weaviate vector DB, Django REST endpoint.

---

## 8. 📅 Qiroat Jadval Tuzuvchi (Recitation Planner)
Foydalanuvchi "30 kunda Quronni xatm qilaman" deydi. Tizim kunlik jadval tuzib beradi (qancha sahifa/juz/sura), progress track qiladi, orqada qolsa yangi jadval taklif qiladi.
**Stack:** Frontend wizard + backend `ReadingPlan` model + Celery daily check.

---

## 9. 🖼️ Tashkil — Tajweed Rang Kodlash
Oyatlar matnida tajwid qoidalari bo'yicha ranglash: qalqala (sariq), madd (ko'k), ghunna (yashil), idgham (to'q yashil). Toggle on/off.
**Stack:** Tajweed-annotated quran dataset (JSON format mevjud, masalan `quran-tajweed` npm paket).

---

## 10. 🔖 Xatcho'p & Izoh (Bookmarks & Notes)
Har bir oyatga xatcho'p qo'yish, shaxsiy izoh yozish, rang belgilash (highlight). "Mening xatcho'plarим" sahifasi.
**Stack:** Django `Bookmark(user, verse, color, note)` model, frontend side-panel.

---

## 11. 🌐 Offline Mode — IndexedDB Cache
Birinchi ochgandan keyin Quron matni va tarjimasi IndexedDB ga saqlansa, internetisiz ham o'qish mumkin. Faqat yangi content sync kerak.
**Stack:** Workbox Service Worker + `idb` library (IndexedDB wrapper) + React Query `persistQueryClient`.

---

## 12. 🎭 Muqobil Qiroatlar (Multiple Qira'at)
Hafs an Asim (default) dan tashqari Warsh, Qalun, al-Duri qiroatlari tanlanishi. Har bir qiroat uchun alohida CDN audio + matn variant.
**Stack:** `everyayah.com` yoki `quranicaudio.com` API, Reciter model extend, frontend qiroat selector.

---

## 13. 🏆 Gamification 2.0 — Badges & Leaderboard
Yutuqlar tizimi kengaytmasi: "Birinchi Xatm", "100 Kun Streak", "Hafiz" badge. Haftalik leaderboard (do'stlar orasida). Raqobat motivatsiya beradi.
**Stack:** `Achievement` model extend, optional social graph (`UserFriendship`), Redis sorted set leaderboard.

---

## 14. 🤝 AI Tafsir Chatbot
Oyat ustiga bosganda "AI bilan so'zlash" tugmasi. Foydalanuvchi oyat haqida savol beradi, Claude/GPT tafsir beradi. Kontekst: oyat matni + klassik tafsir.
**Stack:** Anthropic Claude API (streaming) + Django `ChatSession` model + React streaming hook.

---

## 15. 📱 React Native Mobile App
Mavjud backend va API ni o'zgartirib, React Native (Expo) bilan iOS/Android ilova. Shared business logic (types, API calls), native haptic feedback, background audio.
**Stack:** Expo + React Native + shared `@muslihun/api` package + NativeWind (Tailwind-like).

---

*Priority tavsiya: 3 (Push) → 11 (Offline) → 6 (Word-by-Word) → 2 (Dashboard) → 7 (Semantic Search)*

---

## 16. 🕌 Namoz Vaqtlari — Prayer Times
GPS yoki shahar tanlovi orqali 5 vaqt namoz vaqtlari ko'rsatiladi. Keyingi namozga countdown, azon ovozi, home screen widget. Hisoblash usuli tanlanadi (Karachi, ISNA, MWL).
**Stack:** Aladhan.com API + Geolocation API + Web Push notification + `adhan-js` library.

---

## 17. 🧭 Qibla Yo'nalishi — Qibla Compass
Telefon kompasi orqali Makkaga yo'nalish ko'rsatadi. Animatsiyali igna, ko'rsatilgan daraja va masofa (km). AR overlay optional.
**Stack:** DeviceOrientationEvent API + Geolocation + `qibla` npm (great-circle formula).

---

## 18. 📅 Hijri Taqvim — Islamic Calendar
Hozirgi Hijri sana, muhim islomiy kunlar (Rajab, Sha'bon, Ramazon boshi/oxiri, Laylatul Qadr, Eid). Gregorian ↔ Hijri converter.
**Stack:** `hijri-js` library yoki Aladhan Calendar API + React calendar widget.

---

## 19. 🌟 Kun Oyati — Verse of the Day
Har kuni yangi oyat: arabcha + tarjima + ovoz. Home sahifada katta banner, share tugmasi. Backend har yarim kechada random/curated oyat tanlaydi.
**Stack:** Django management command (Celery Beat) + `VerseOfDay` model + frontend banner.

---

## 20. 🤲 Duolar Kutubxonasi — Dua Collection
Kategoriyalash: saharga, iftorga, uyqu, safar, kasallik, yangi oy duolari. Arabcha + transliteratsiya + tarjima. Qidirish. Sevimlilar.
**Stack:** `Dua` model (category, arabic, transliteration, source) + Django fixtures, frontend filter UI.

---

## 21. 📿 99 Allohning Ismi — Asmaul Husna
99 ta ismning arabchasi, transliteratsiyasi, ma'nosi, qisqacha tafsiri. Har bir ism uchun zikr sanagich. Beautiful grid + detail modal.
**Stack:** Static JSON fixture + React grid view + local `zustand` counter per name.

---

## 22. 💬 Hadis Kundaligi — Hadith of the Day
Sah Buxoriy, Muslim, Abu Dovud dan tanlab olingan hadis — arabcha + tarjima. Kategoriya: ilm, sabr, sadaqa. Share card.
**Stack:** `sunnah.com` API yoki lokal `Hadith` model + kunilik rotation (Celery Beat).

---

## 23. 😴 Audio Sleep Timer — Uxlash Taymer
Audio 15/30/60/90 daqiqadan keyin to'xtaydi. Taymer tugaganda ovoz sekin pasayadi (fade-out). Countdown indicator AudioPlayerBar'da.
**Stack:** `setTimeout` + `setInterval` fade logic + audioStore `sleepTimer` state.

---

## 24. 🚗 Avto Rejim — Driving Mode
Katta tugmalar, minimal UI, ovozli navigatsiya. Faqat: oldingi/keyingi sura, play/pause, ovoz balandligi. Portret + landshaft.
**Stack:** React route `/car` + simplified layout + `useWakeLock` (Screen Wake Lock API).

---

## 25. 👶 Bolalar Rejimi — Kids Mode
Qisqa suralar (Al-Fotiha, Al-Ikhlas, Al-Falaq...), yulduz mukofot, ranglik animatsiyalar. PIN bilan qulflanadi (boshqa rejimlarga o'tib ketmasin).
**Stack:** `KidsModeStore` (PIN, allowed surahs) + simplified React route + Lottie animations.

---

## 26. 🔎 Kengaytirilgan Qidiruv — Advanced Search
Filter: juz raqami, hizb, sahifa oralig'i, vahiy turi (makka/madina), oyat uzunligi, sajda oyatlari. Bir vaqtda bir nechta filter kombinatsiyasi.
**Stack:** Django `Q()` filter chaining + DRF query params + frontend multi-select filter drawer.

---

## 27. 📤 Oyat Ulashish — Verse Share Card
Oyat tanlanganda "Ulashish" tugmasi — canvas'da chiroyli karta generatsiya: arabcha matn, tarjima, sura nomi, gradient fon. PNG yuklab olish yoki WhatsApp/Telegram share.
**Stack:** `html2canvas` yoki `@napi-rs/canvas` (server-side) + Web Share API + Blob URL download.

---

## 28. 📂 Bookmark Eksport/Import — Backup
Xatcho'plarni JSON, PDF yoki CSV formatda yuklab olish. Boshqa qurilmada import qilish. ICloud/Google Drive sync optional.
**Stack:** Django export endpoint (`Content-Disposition: attachment`) + `jsPDF` frontend + file input for import.

---

## 29. 👨‍👩‍👧‍👦 Ko'p Profil — Family Mode
Bir qurilmada bir nechta profil (ota, ona, bola). Har profil alohida progress, xatcho'p, sozlamalar. Tez profil almashtirish (avatar tap).
**Stack:** LocalStorage `activeProfile` + profile switcher UI + profile-scoped Zustand stores.

---

## 30. 🔀 Tarjima Taqqoslash — Side-by-Side
Bir oyatni ikki tilda bir vaqtda ko'rish: masalan O'zbekcha + Ruscha, yoki O'zbekcha + Inglizcha. Scroll sync.
**Stack:** Frontend dual-column layout + ikkinchi `lang` query param + React query parallel fetch.

---

## 31. ✅ Xatm Hisoblagich — Khatm Tracker
Foydalanuvchi nechta marta Qur'on xatm qilganini belgilaydi. Har xatm: sana, qancha vaqt ketdi, kim uchun (niyat). Tarix ro'yxati.
**Stack:** Django `Khatm(user, started_at, completed_at, intention)` model + frontend wizard.

---

## 32. 📜 Xatm Sertifikati — PDF Certificate
Xatm tugaganda chiroyli PDF sertifikat: foydalanuvchi ismi (arabcha), xatm sanasi, Hijri sana, QR kod. Yuklab olish yoki ulashish.
**Stack:** `WeasyPrint` yoki `reportlab` Django PDF generation + sertifikat HTML template.

---

## 33. 🎓 Tajweed Darslari — Interactive Lessons
15 ta asosiy tajwid qoidasi: video/animatsiya misollar, mashqlar (to'g'ri talaffuzni tanlab), progress tracking. Qoidalar Mushaf'da highlight bilan bog'liq.
**Stack:** Structured `TajweedLesson` model + video CDN + interactive MCQ component.

---

## 34. 🧩 Arabcha Lug'at — Vocabulary Builder
Oyatlardagi yangi so'zlar flashcard formatda: arabcha → ma'no → misollar. Spaced repetition (SM-2) bilan takror. "Bugun 10 so'z o'rgan" maqsadi.
**Stack:** `WordCard(arabic, root, meaning, example_verse)` model + SM-2 (hifz logikasidan reuse).

---

## 35. 📝 Bulutli Eslatmalar — Cloud Notes
Har bir oyatga yozilgan izoh barcha qurilmalarda sinxron bo'ladi. Rich text editor (bold, list). Oyat bilan birga ko'rsatiladi.
**Stack:** Django `Note(user, verse, content, updated_at)` + DRF + `@tiptap/react` editor.

---

## 36. 🎵 Audio Pleylist — Custom Range
Foydalanuvchi "Al-Baqara 1-10" yoki "Juz 30" ni pleylist sifatida tanlaydi. Avtoplay, loop, shuffle. Tunda yoqib uxlash uchun ham.
**Stack:** `audioStore` `playlist: Verse[]` + sequential `nextVerse()` through playlist + shuffle algorithm.

---

## 37. 🐢 Audio Tezlik — Playback Speed
0.5x, 0.75x, 1x, 1.25x, 1.5x tezlik. Qori bilan bir vaqtda talaffuz qilish uchun sekinroq yoki tezroq eshitish.
**Stack:** `audio.playbackRate` HTML5 property + speed selector in AudioPlayerBar.

---

## 38. 📳 Fon Audio — Background Playback
Telefon ekrani o'chirilganda audio to'xtamasdan davom etadi. Lock screen'da media controls (MediaSession API).
**Stack:** MediaSession API (`setActionHandler` play/pause/next) + `noSleep.js` yoki WakeLock.

---

## 39. 🏠 PWA — Installable App
"Add to Home Screen" banner. Offline first (service worker). Push notifications. Splash screen, app icon, standalone mode.
**Stack:** Vite PWA plugin (`vite-plugin-pwa`) + Workbox + Web App Manifest.

---

## 40. 📊 O'qish Tahlili — Reading Analytics
Kunlik/haftalik/oylik o'qilgan oyatlar soni, vaqt, eng ko'p o'qilgan sura, sahifa. Heatmap (GitHub uslubida). Export CSV.
**Stack:** Django `ReadingSession(user, surah, pages_read, duration, date)` + aggregation API + Recharts.

---

## 41. 🏅 Streak Himoyasi — Streak Freeze
Duolingo'dagi kabi: 3 ta "muzlatgich" token. Kun o'tib ketsa bitta token sarflanadi, streak saqlanadi. Har 10 kun bir token topiladi.
**Stack:** `StreakFreeze(user, count)` model + `GamificationService.use_freeze()` + UI indicator.

---

## 42. 👥 Do'stlar — Social Features
Do'stlarni qo'shish (username bo'yicha), do'stlar progressini ko'rish (streak, xatm soni). Haftalik leaderboard faqat do'stlar orasida.
**Stack:** `Friendship(from_user, to_user, status)` model + privacy settings + leaderboard Redis sorted set.

---

## 43. 🌍 Ko'p Tilli Interfeys — Multilingual UI
Ilova interfeysi o'zbekcha, ruscha, inglizcha bo'ladi. `i18next` bilan string management. Til sozlamalarida tanlanadi.
**Stack:** `react-i18next` + JSON locale files (`uz.json`, `ru.json`, `en.json`) + `<I18nextProvider>`.

---

## 44. ♿ Accessibility — A11y
WCAG 2.1 AA: screen reader (`aria-label`), keyboard navigation, focus trap in drawers, color contrast ratio, skip links, reduced motion media query.
**Stack:** `@radix-ui` primitives (accessible by default) + `axe-core` CI check + `prefers-reduced-motion`.

---

## 45. 🌙 Ramadan Tracker — Ro'za Hisoblagich
Sahur/iftor vaqtlari (lokatsiyaga qarab), ro'za niyati, bugun ro'za tutilganmi belgisi, oy davomida nechi kun tutilgan. Iftor yaqinlashganda vibration + notification.
**Stack:** Aladhan timing API + `FastingLog(user, date, kept)` model + countdown timer.

---

## 46. 💰 Zakat Kalkulyator — Zakot Hisoblagichi
Nisob (oltin/kumush narxi bo'yicha), mol-mulk, qarz kiritiladi. Zakat miqdori hisoblanadi. Hisoblash uslubi tanlanadi.
**Stack:** Static calculation logic (2.5%) + gold/silver price API + frontend form.

---

## 47. 🎙️ Ovozli Qidiruv — Voice Search
Mikrofon tugmasiga bosilib oyat nomi yoki raqami aytiladi, qidiruv bajariladi. "Al-Fotiha" → sura sahifasiga o'tadi.
**Stack:** Web Speech API (`SpeechRecognition`) + existing search endpoint + intent parsing.

---

## 48. 🖼️ AR Quron Skaneri — Page Scanner
Kamera orqali bosmа Quron sahifasiga ko'rsatilsa, sahifa raqami aniqlanadi va app'da o'sha sahifa ochiladi. QR-code-like matching.
**Stack:** TensorFlow.js (page number OCR) yoki `tesseract.js` + overlay UI + camera access.

---

## 49. 🔔 Aqlli Eslatmalar — Smart Reminders
Foydalanuvchi odatini o'rganib eslatma vaqtini taklif qiladi: "Siz odatda 21:00 da o'qiysiz, eslatma qo'yaylikmi?" Streak xavf ostida bo'lganda qo'shimcha eslatma.
**Stack:** `ActivityPattern` aggregation + Celery Beat dynamic scheduling + Web Push.

---

## 50. 📱 Landscape Rejimi — Tablet/Desktop Layout
Keng ekranda (≥768px): chap panel — sura ro'yxati, o'ng panel — oyatlar. Tablet va desktop uchun optimallashtirilgan ikki ustunli layout.
**Stack:** Tailwind `md:grid-cols-[280px_1fr]` + `useMediaQuery` hook + responsive Drawer → sidebar.

---

## 51. 🎨 Maxsus Mavzu — Custom Theme
Foydalanuvchi asosiy rang (accent), fon, shrift tanlaydi. Bir nechta preset mavzu: Zaytun (yashil), Lazur (ko'k), Shafaq (to'q sariq). Saqlanadi.
**Stack:** CSS custom properties runtime update + `themeStore` (`accent`, `bg`, `fontFamily`) + color picker.

---

## 52. 📖 Tafsir Solishtirish — Multi-Tafsir View
Bir oyat uchun bir vaqtda bir nechta tafsir ko'rsatiladi: Ibn Kasir, Tabari, Qurtubi. Accordion/tab UI.
**Stack:** `Tafsir(verse, source, language, content)` extend + parallel API fetch + tab component.

---

## 53. 🔗 Deep Link — Oyat Ulashish
`muslihun.app/ayah/2:255` kabi URL ochilganda to'g'ridan-to'g'ri o'sha oyatga o'tadi. WhatsApp/Telegram'dan ulashilgan link ishlaydi.
**Stack:** React Router dynamic route `/ayah/:surah/:verse` + meta og tags (OpenGraph) + SSR optional.

---

## 54. 🖨️ Chop Etish — Print Mode
Oyatlar, tarjima, izoh va xatcho'plarni PDF yoki printer uchun format. Arabcha RTL, serif font, sahifa raqami.
**Stack:** CSS `@media print` stylesheet + `window.print()` + print-specific React component.

---

## 55. 🤖 AI Oyat Tavsiyasi — Personalized Verses
Foydalanuvchi o'qigan va bookmarklagan oyatlar tahlilidan kelib chiqib, "Siz uchun tavsiya" oyatlar listasi. Collaborative filtering yoki embedding similarity.
**Stack:** `sentence-transformers` embedding + user interest vector + cosine similarity ranking.

---

## 56. 📡 Sinxron Tarjima — Live Translation
Foydalanuvchi mikrofonga yoki matn kiritsa, real-time arabcha tarjima. Mashq uchun: tarjima kiritiladi, arabcha tekshiriladi.
**Stack:** LibreTranslate API yoki DeepL Arabic model + WebSocket streaming.

---

## 57. 🗺️ Juz Xaritasi — Juz Navigator
30 ta juz vizual xaritasi: har juz qaysi sura/oyatdan boshlanadi, qancha sahifa. Color-coded progress (o'qilgan/o'qilmagan). Juz tap → reader ochiladi.
**Stack:** `NavigationData.juz` dan keladigan data + SVG/grid visualization + progress overlay.

---

## 58. 🧘 Fokus Rejimi — Distraction-Free
Barcha UI elementlari yashirinadi, faqat arabcha matn va ozgina navigation. Timer (Pomodoro 25 min). Tugaganda achievement.
**Stack:** `focusMode: boolean` UI store + CSS overlay hide + `useTimer` hook.

---

## 59. 🏆 Raqobat Musobaqasi — Hifz Competition
Foydalanuvchilar orasida haftalik hifz musobaqasi: kim ko'proq oyat yodladi. Guruh yaratish, challenge yuborish, natijalar.
**Stack:** `Competition` model + participant join + leaderboard + end-date auto close.

---

## 60. 📻 Radio Rejimi — Quran Radio
Doiraviy efir: turli qorilar Quronni o'qiydi. Hozir qaysi sura/oyat ko'rsatiladi. Background'da ishlaydi.
**Stack:** `quranradio.com` yoki custom icecast stream + HLS.js player + metadata parsing.

---

## 61. 🌅 Kunlik Ruhiy Marshrutlash — Daily Spiritual Journey
Har kuni: 1 oyat + 1 dua + 1 hadis + 1 zikr. 5 daqiqalik "minimal ibodat" paketi. Streak bilan bog'langan.
**Stack:** Django `DailySpiritualPlan` generator (Celery) + frontend card sequence + completion check.

---

## 62. 📈 Hafiz Progress Xaritasi — Memorization Map
Qur'onning 604 sahifasi vizual grid: har katak rangida — yodlanmagan (kulrang), jarayonda (sariq), yodlangan (yashil), mustahkam (ko'k). Interactive.
**Stack:** SVG 604-cell grid + HifzProgress aggregation + color mapping + click → detail.

---

## 63. 🔁 Takroriy Talaffuz — Loop Mode
Tanlangan oyat (yoki qism) N marta takrorlanadi. Qori bilan birga o'qish uchun. Har takror orasida 2 soniya pauza.
**Stack:** `audioStore` `loopCount: number` + `loopCurrent: number` + loop completion logic.

---

## 64. 🛡️ Xavfsizlik — 2FA / Biometric
Ilova ochilganda Face ID / Touch ID yoki PIN kiritiladi. Shaxsiy ma'lumotlar (progress, notes) himoyalangan.
**Stack:** Web Authentication API (WebAuthn) + `LocalAuthentication` (mobile) + PIN fallback.

---

## 65. 🌐 Tarmoq Holati — Connection Indicator
Offline bo'lganda banner: "Siz oflayn rejimdasyiz — keshdan o'qilmoqda". Onlayn bo'lganda avtomatik sync + "Yangilandi" toast.
**Stack:** `navigator.onLine` + `online/offline` event listeners + React Query `onlineManager`.
