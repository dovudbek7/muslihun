# 📖 Quran App — Next-Gen Cross-Platform Application

Zamonaviy, minimalistik va premium dizaynga ega, Qur'oni Karimni o'qish, tinglash hamda sun'iy intellekt elementlari yordamida hifz qilish (yod olish) uchun mo'ljallangan ilg'or ekotizim (Web + Mobile).

---

## 🌎 1. Interfeys va Globallashuv (Localization)

Ilova to'liq universallikni ta'minlash uchun dinamik ravishda quyidagi tillarga moslashadi:
* **O'zbekcha (Lotin)**
* **Ўзбекча (Кирил)**
* **Русский**
* **English**

---

## 📖 2. Mushaf va O'qish Rejimlari (Reading Modes)

Foydalanuvchiga matnni o'qish va vizual sozlash uchun cheksiz erkinlik beriladi:
* **Klassik Mushaf (Page Mode):** Haqiqiy bosma Qur'on kabi sahifalab o'qish rejimi. Ekranda aniq sahifa raqami, tegishli Juz va Sura nomi dinamik aks etib turadi.
* **Scroll Mode:** Pastga cheksiz aylantirib (vertikal) o'qish tizimi.
* **Vizual Customization (Moslashtirish):**
    * *Oddiy matn:* Klassik va yengil shriftlar.
    * *Tajvid rejimi:* Qoidalarni maxsus ranglar va belgilar bilan ajratib ko'rsatish.
    * *Luxury Dark Mode:* Ko'zni charchatmaydigan, quyuq jigarrang va tilla rang elementlar uyg'unligidagi premium tungi dizayn.
    * *Shrift sozlamalari:* Arabcha matnlar uchun o'ta sifatli va an'anaviy **Uthmanic (Hafs)** shrifti qo'llaniladi (yuklanish kechikmasligi uchun local saqlanadi).

---

## 🧩 3. Aqlli Navigatsiya va Qidiruv Moduli (Advanced Navigation & Search)

Ilovaning yuqori qismida o'ta qulay va ko'p funksiyali boshqaruv paneli mavjud:
* **Uch tomonlama Navigatsiya:** Foydalanuvchi sahifa raqami, Juz yoki Sura nomining ustiga bosish orqali modal oyna yordamida (yoki scroll qilib) kerakli joyga bir lahzada o'ta oladi.
* **Aqlli Qidiruv (Fuzzy Search):** * Qidiruv tizimi har qanday daryodagi xatolarni to'g'rilab qidiradi (Masalan: `Al-Baqara`, `Bakara`, `Бақара` deb yozilganda ham yagona to'g'ri natijani chiqaradi).
    * Qidiruv natijalarida nafaqat sura nomi, balki qidirilayotgan so'z qaysi **sahifa, juz va oyatda** joylashganini ham ierarxik ko'rinishda ko'rsatib beradi.

---

## 🧠 4. Eksklyuziv Hifz Rejimi (Hifz Mode & AI Speech-to-Text)

Qur'onni yod oluvchilar uchun bozorda muqobili kam bo'lgan intellektual tizim:
* **Blind Mode (To'liq yopiq):** Oyatlar ekranda umuman ko'rinmaydi. Foydalanuvchi mikrofonga qiroat qilishi (yoki keyingi tugmasini bosishi) bilan o'qilgan qism real vaqtda ochilib boradi.
* **Hint Mode (Xira rejim):** Oyatlar matni biroz xira (blur/opacity) holatda ko'rinib turadi, bu xotirani shakllantirishga yordam beradi.
* **🔴 🟡 "Sariq va Qizil" Xatolar Logi (Error Tracking):**
    * Hifz jarayonida mikrofondan kelayotgan ovoz tabiati tekshirilganda, foydalanuvchi adashgan yoki noto'g'ri o'qigan oyat qismlari **qizil** (qo'pol xato) yoki **sariq** (kichik maxraj/tajvid xatosi) bo'lib belgilanadi.
    * Ushbu xatolar foydalanuvchining shaxsiy **"Mening xatolarim" (Error Log)** daryosiga yig'iladi. Kelajakda tizim foydalanuvchiga faqat o'zi ko'p adashadigan oyatlarini qayta takrorlashni taklif qiladi.

---

## 🎧 5. Audio Qiroat va Tafsir Moduli

* **Oyatma-oyat qiroat:** Istalgan oyat ustiga bosilganda o'sha oyatning o'zi alohida ijro etiladi.
* **Ko'p modulli audio tizim:** Foydalanuvchi bitta oyatni cheksiz takrorlashni, ma'lum bir surani yoki to'liq qiroatni tinglashni boshqara oladi.
* **Mashhur Qorilar bazasi:** Mishary Rashid Alafasy, Muhammad Al-Luhaidan va boshqalar.
* **Dinamik Tafsir:** Har bir oyat yonidagi "Tafsir" tugmasini bosish orqali alohida oynada mukammal sharhlar ochiladi. Hozircha mavjud tillar: *English, Русский, Türkçe* (O'zbekcha tafsir bazasi keyinchalik `null=True` arxitekturasi orqali to'ldiriladi).

---

## 📿 6. Qo'shimcha va Rag'batlantiruvchi Feature-lar (Gamification)

* **Smart Tasbeh (+ Feature):** * Minimalistik va chiroyli zikr paneli. Maxsus maqsadli zikrlar (masalan, 33 talik paketlar) mavjud. 
    * Chegaraga yetganda telefon yengil vibratsiya (Haptic feedback) beradi va avtomatik keyingi zikrga o'tadi. Har bir bosishda ekranda mayin to'lqinlar (ripple effect) hosil bo'ladi.
* **🔥 Streak Tizimi (Kunlik Davomiylik):** Foydalanuvchi necha kundan beri uzluksiz Qur'on o'qiyotgani yoki tizimdan foydalanayotganini qayd etadi (Duolingo uslubida). Bu foydalanuvchini har kuni ilovaga kirishga ruhan rag'batlantiradi.
* **🕌 Namoz Vaqtlari Countdown:** Ekranning eng yuqori qismida joriy joylashuvga qarab keyingi namoz vaqtigacha qancha soat va soniya qolganini ko'rsatib turuvchi real-time taymer.

---

## 🛠 7. Tizim Arxitekturasi va Texnologik Stack

Loyiha kelajakda mobil ilovani (Mobile App) minimal o'zgarishlar bilan tizimga integratsiya qilish uchun **Offline-First** va **Microservices-ready** tamoyili asosida qurilgan:

* **Backend:** Python / Django REST Framework (yoki FastAPI) + WebSockets (Real-time audio va hifz oqimi uchun).
* **Frontend (Web):** React / TypeScript + Tailwind CSS (Dizayn minimalizm va luxury qonuniyatlariga asoslangan).
* **Database & Cache:** PostgreSQL (Asosiy ma'lumotlar) + Redis (Qur'on matnlari va statik tarjimalarni keshda saqlash, server yuklamasini kamaytirish uchun).
* **Audio & Media:** Audio fayllar Cloudflare R2 / AWS S3 object storage-da saqlanadi va CDN orqali tezkor oqim (streaming) qilinadi.
* **AI/STT (Speech-to-Text):** Hifz rejimida arab tili va maxrajlarni aniqlash uchun fine-tune qilingan Whisper modelidan foydalaniladi.