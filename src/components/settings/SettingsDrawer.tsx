import { Moon, Sun, Monitor, Type, BookOpen, AlignJustify, Mic } from 'lucide-react'
import { Drawer } from '@/components/ui/Drawer'
import { useUIStore, type Theme } from '@/stores/uiStore'
import { useQuranStore } from '@/stores/quranStore'
import { cn } from '@/components/ui/cn'
import { RECITERS } from '@/constants/quran'

const THEMES: { id: Theme; label: string; icon: React.ReactNode; bg: string }[] = [
  { id: 'dark', label: 'Qora', icon: <Moon size={16} />, bg: 'bg-[#120F0E] border-[#D4AF37]/20' },
  { id: 'light', label: 'Oq', icon: <Sun size={16} />, bg: 'bg-[#FAFAF8] border-gray-200' },
  { id: 'gray', label: 'Kulrang', icon: <Monitor size={16} />, bg: 'bg-[#1C1C1E] border-[#48484A]' },
]

const FONT_SIZES = [
  { label: 'Kichik', value: 18 },
  { label: 'O\'rta', value: 22 },
  { label: 'Katta', value: 26 },
  { label: 'Juda katta', value: 30 },
]

export function SettingsDrawer() {
  const { activeDrawer, closeDrawer, theme, setTheme } = useUIStore()
  const {
    readingMode, setReadingMode,
    fontSize, setFontSize,
    tajweedMode, toggleTajweedMode,
    arabicOnly, toggleArabicOnly,
    showTransliteration, toggleTransliteration,
    showInlineTafsir, toggleInlineTafsir,
    reciterIdentifier, setReciterIdentifier,
  } = useQuranStore()

  const open = activeDrawer === 'settings'

  return (
    <Drawer open={open} onClose={closeDrawer} title="Sozlamalar" side="bottom" className="h-[80dvh]">
      <div className="p-4 space-y-6 overflow-y-auto max-h-[70dvh]">

        {/* Theme */}
        <section>
          <p className="text-text-muted text-xs font-medium uppercase tracking-wider mb-3">Mavzu</p>
          <div className="grid grid-cols-3 gap-2">
            {THEMES.map(t => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={cn(
                  'flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all',
                  t.bg,
                  theme === t.id ? 'border-accent' : 'border-transparent opacity-70 hover:opacity-100'
                )}
              >
                <div className={cn('w-8 h-8 rounded-full flex items-center justify-center', t.bg)}>
                  {t.icon}
                </div>
                <span className="text-xs font-medium" style={{ color: theme === t.id ? 'var(--accent)' : 'var(--text-muted)' }}>
                  {t.label}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Reading mode */}
        <section>
          <p className="text-text-muted text-xs font-medium uppercase tracking-wider mb-3">O'qish rejimi</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setReadingMode('scroll')}
              className={cn(
                'flex items-center gap-2 px-4 py-3 rounded-xl border transition-all text-sm font-medium',
                readingMode === 'scroll'
                  ? 'bg-accent/10 border-accent/40 text-accent'
                  : 'bg-bg-elevated border-border-subtle text-text-secondary hover:border-border'
              )}
            >
              <AlignJustify size={15} />
              Scroll
            </button>
            <button
              onClick={() => setReadingMode('mushaf')}
              className={cn(
                'flex items-center gap-2 px-4 py-3 rounded-xl border transition-all text-sm font-medium',
                readingMode === 'mushaf'
                  ? 'bg-accent/10 border-accent/40 text-accent'
                  : 'bg-bg-elevated border-border-subtle text-text-secondary hover:border-border'
              )}
            >
              <BookOpen size={15} />
              Mushaf
            </button>
          </div>
        </section>

        {/* Font size */}
        <section>
          <p className="text-text-muted text-xs font-medium uppercase tracking-wider mb-3">Shrift o'lchami</p>
          <div className="grid grid-cols-4 gap-2">
            {FONT_SIZES.map(f => (
              <button
                key={f.value}
                onClick={() => setFontSize(f.value)}
                className={cn(
                  'flex flex-col items-center gap-1 py-2.5 rounded-xl border transition-all',
                  fontSize === f.value
                    ? 'bg-accent/10 border-accent/40 text-accent'
                    : 'bg-bg-elevated border-border-subtle text-text-secondary hover:border-border'
                )}
              >
                <Type size={fontSize === f.value ? 16 : 14} />
                <span className="text-[10px]">{f.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Toggles */}
        <section>
          <p className="text-text-muted text-xs font-medium uppercase tracking-wider mb-3">Ko'rsatish</p>
          <div className="space-y-2">
            <Toggle
              label="Tajvid ranglari"
              description="Tajvid qoidalarini rang bilan ko'rsatish"
              active={tajweedMode}
              onToggle={toggleTajweedMode}
            />
            <Toggle
              label="Faqat arabcha"
              description="Tarjimani yashirish"
              active={arabicOnly}
              onToggle={toggleArabicOnly}
            />
            <Toggle
              label="Transliteratsiya"
              description="Lotin harflarida talaffuz"
              active={showTransliteration}
              onToggle={toggleTransliteration}
            />
            <Toggle
              label="Tafsir (inline)"
              description="Har oyat tagida tafsirni ko'rsatish"
              active={showInlineTafsir}
              onToggle={toggleInlineTafsir}
            />
          </div>
        </section>

        {/* Reciter */}
        <section>
          <p className="text-text-muted text-xs font-medium uppercase tracking-wider mb-3">Qori</p>
          <div className="space-y-1">
            {RECITERS.map(r => (
              <button
                key={r.id}
                onClick={() => setReciterIdentifier(r.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-left',
                  reciterIdentifier === r.id
                    ? 'bg-accent/10 border border-accent/30'
                    : 'hover:bg-bg-elevated border border-transparent'
                )}
              >
                <Mic size={14} className={reciterIdentifier === r.id ? 'text-accent' : 'text-text-muted'} />
                <div>
                  <span className={cn('text-sm block', reciterIdentifier === r.id ? 'text-accent font-medium' : 'text-text-secondary')}>
                    {r.name}
                  </span>
                  <span className="font-arabic text-xs text-text-muted">{r.name_ar}</span>
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>
    </Drawer>
  )
}

function Toggle({
  label, description, active, onToggle,
}: {
  label: string
  description: string
  active: boolean
  onToggle: () => void
}) {
  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-bg-elevated border border-border-subtle hover:border-border transition-all"
    >
      <div className="text-left">
        <p className="text-text-primary text-sm font-medium">{label}</p>
        <p className="text-text-muted text-xs mt-0.5">{description}</p>
      </div>
      <div className={cn(
        'w-11 h-6 rounded-full transition-colors relative flex-shrink-0',
        active ? 'bg-accent' : 'bg-bg-hover'
      )}>
        <div className={cn(
          'absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform',
          active ? 'translate-x-6' : 'translate-x-1'
        )} />
      </div>
    </button>
  )
}
