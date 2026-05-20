export const TOTAL_SURAHS = 114
export const TOTAL_PAGES = 604
export const TOTAL_JUZZ = 30
export const TOTAL_VERSES = 6236

export const FONT_SIZE_MIN = 14
export const FONT_SIZE_MAX = 48
export const FONT_SIZE_DEFAULT = 20
export const FONT_SIZE_STEP = 2

export const ARABIC_FONT_SIZE_CLASSES: Record<number, string> = {
  14: 'text-[1.4rem] leading-[2.4rem]',
  16: 'text-[1.6rem] leading-[2.6rem]',
  18: 'text-[1.8rem] leading-[3rem]',
  20: 'text-[2rem] leading-[3.4rem]',
  24: 'text-[2.4rem] leading-[4rem]',
  28: 'text-[2.8rem] leading-[4.5rem]',
  32: 'text-[3.2rem] leading-[5.2rem]',
  36: 'text-[3.6rem] leading-[6rem]',
  40: 'text-[4rem] leading-[6.5rem]',
  48: 'text-[4.8rem] leading-[8rem]',
}

export const SURAH_NAMES_AR: Record<number, string> = {
  1: 'الفاتحة', 2: 'البقرة', 3: 'آل عمران', 4: 'النساء',
  5: 'المائدة', 6: 'الأنعام', 7: 'الأعراف', 8: 'الأنفال',
  9: 'التوبة', 10: 'يونس', 11: 'هود', 12: 'يوسف',
  36: 'يس', 55: 'الرحمن', 56: 'الواقعة', 67: 'الملك',
  78: 'النبأ', 112: 'الإخلاص', 113: 'الفلق', 114: 'الناس',
}

export const PRAYER_METHOD_OPTIONS = [
  { value: 1, label: 'Muslim World League' },
  { value: 2, label: 'Islamic Society of North America' },
  { value: 3, label: 'Egyptian General Authority' },
  { value: 4, label: 'Umm Al-Qura University, Makkah' },
  { value: 5, label: 'University of Islamic Sciences, Karachi' },
]

export const RECITERS = [
  { id: 'ar.alafasy', name: 'Mishary Alafasy', name_ar: 'مشاري العفاسي' },
  { id: 'ar.abdulbasitmurattal', name: 'Abdul Basit (Murattal)', name_ar: 'عبد الباسط' },
  { id: 'ar.minshawi', name: 'Mohamed Al-Minshawi', name_ar: 'محمد المنشاوي' },
  { id: 'ar.husary', name: 'Mahmoud Al-Husary', name_ar: 'محمود الحصري' },
  { id: 'ar.mahermuaiqly', name: 'Maher Al-Muaiqly', name_ar: 'ماهر المعيقلي' },
] as const

export type ReciterId = typeof RECITERS[number]['id']

export const LANGUAGE_LABELS: Record<string, string> = {
  en: 'English',
  ru: 'Русский',
  tr: 'Türkçe',
  uz_latin: "O'zbekcha",
  uz_cyrillic: 'Ўзбекча',
}
