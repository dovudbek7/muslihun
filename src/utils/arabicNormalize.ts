const TASHKEEL = /[ؐ-ًؚ-ٰٟ]/g
const QURAN_MARKS = /[ۖ-ۜ۟-ۤۧ-۪ۨ-ۭ]/g
const TATWEEL = /ـ/g

export function stripTashkeel(text: string): string {
  return text.replace(TASHKEEL, '').replace(QURAN_MARKS, '').replace(TATWEEL, '')
}

export function normalizeArabic(text: string): string {
  return stripTashkeel(text)
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .trim()
}

export function splitWords(ayah: string): string[] {
  return ayah.trim().split(/\s+/).filter(Boolean)
}

export function wordsMatch(input: string, expected: string): boolean {
  return normalizeArabic(input) === normalizeArabic(expected)
}
