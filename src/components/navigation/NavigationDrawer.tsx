import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookOpen, Layers, AlignJustify, X } from 'lucide-react'
import { Drawer } from '@/components/ui/Drawer'
import { Input } from '@/components/ui/Input'
import { Spinner } from '@/components/ui/Spinner'
import { useNavigationData } from '@/api/quran'
import { useQuranStore } from '@/stores/quranStore'
import { useUIStore } from '@/stores/uiStore'
import { buildRoute } from '@/constants/routes'
import { cn } from '@/components/ui/cn'
import type { Language } from '@/types/quran'

type Tab = 'surah' | 'page' | 'juz'

const TAB_ICONS = {
  surah: BookOpen,
  page: AlignJustify,
  juz: Layers,
}

const TAB_LABELS = { surah: 'Sura', page: 'Sahifa', juz: 'Juz' }

export function NavigationDrawer() {
  const { activeDrawer, closeDrawer } = useUIStore()
  const [tab, setTab] = useState<Tab>('surah')
  const [search, setSearch] = useState('')
  const [pageInput, setPageInput] = useState('')
  const navigate = useNavigate()
  const { navigateTo, language } = useQuranStore()
  const { data, isLoading } = useNavigationData()

  const open = activeDrawer === 'surah' || activeDrawer === 'page' || activeDrawer === 'juz'

  const filteredSurahs = useMemo(() => {
    if (!data?.surahs) return []
    const q = search.toLowerCase()
    if (!q) return data.surahs
    return data.surahs.filter(s =>
      s.name_transliteration.toLowerCase().includes(q) ||
      s.name_en.toLowerCase().includes(q) ||
      String(s.number).includes(q)
    )
  }, [data?.surahs, search])

  const getSurahName = (s: import('@/types/quran').Surah): string => s.name_transliteration

  const handleSurahSelect = (surahNumber: number, pageStart: number) => {
    navigateTo(surahNumber, 1, pageStart)
    navigate(buildRoute.surah(surahNumber))
    closeDrawer()
    setSearch('')
  }

  const handlePageJump = () => {
    const n = parseInt(pageInput)
    if (n >= 1 && n <= 604) {
      navigate(buildRoute.page(n))
      closeDrawer()
      setPageInput('')
    }
  }

  const handleJuzSelect = (juzNumber: number) => {
    navigate(buildRoute.juz(juzNumber))
    closeDrawer()
  }

  return (
    <Drawer open={open} onClose={closeDrawer} title="Navigatsiya" side="bottom" className="h-[80dvh]">
      <div className="flex border-b border-border-subtle">
        {(['surah', 'page', 'juz'] as Tab[]).map((t) => {
          const Icon = TAB_ICONS[t]
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                'flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors',
                tab === t ? 'text-accent border-b-2 border-accent' : 'text-text-muted hover:text-text-secondary'
              )}
            >
              <Icon size={16} />
              {TAB_LABELS[t]}
            </button>
          )
        })}
      </div>

      <div className="p-4">
        {isLoading ? (
          <div className="flex justify-center py-10"><Spinner /></div>
        ) : (
          <>
            {tab === 'surah' && (
              <div className="space-y-3">
                <Input
                  placeholder="Sura nomi yoki raqamini kiriting..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  autoFocus
                />
                <div className="space-y-1 max-h-[55dvh] overflow-y-auto no-scrollbar">
                  {filteredSurahs.map((s, i) => (
                    <motion.button
                      key={s.number}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: Math.min(i * 0.015, 0.3) }}
                      onClick={() => handleSurahSelect(s.number, s.page_start)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-bg-elevated transition-colors text-left"
                    >
                      <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-bg-hover text-xs font-mono text-text-muted flex-shrink-0">
                        {s.number}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary truncate">
                          {getSurahName(s)}
                        </p>
                        <p className="text-xs text-text-muted">{s.total_verses} oyat · {s.revelation_type}</p>
                      </div>
                      <span className="font-arabic text-base text-text-arabic flex-shrink-0">
                        {s.name_arabic}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {tab === 'page' && (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="1 – 604"
                    min={1}
                    max={604}
                    value={pageInput}
                    onChange={e => setPageInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handlePageJump()}
                  />
                  <button
                    onClick={handlePageJump}
                    className="btn-primary px-4 text-sm whitespace-nowrap"
                  >
                    O'tish
                  </button>
                </div>
                <div className="grid grid-cols-8 gap-1 max-h-[50dvh] overflow-y-auto no-scrollbar py-1">
                  {Array.from({ length: 604 }, (_, i) => i + 1).map(n => (
                    <button
                      key={n}
                      onClick={() => { navigate(buildRoute.page(n)); closeDrawer() }}
                      className="h-9 text-xs rounded-lg bg-bg-elevated hover:bg-bg-hover hover:text-accent transition-colors text-text-muted"
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {tab === 'juz' && (
              <div className="grid grid-cols-3 gap-2 max-h-[60dvh] overflow-y-auto no-scrollbar py-1">
                {Array.from({ length: 30 }, (_, i) => i + 1).map(juz => {
                  const info = data?.juz?.find(j => j.juz_number === juz)
                  return (
                    <motion.button
                      key={juz}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleJuzSelect(juz)}
                      className="flex flex-col items-center gap-1 p-3 rounded-xl bg-bg-elevated hover:bg-bg-hover hover:border-accent/30 border border-transparent transition-all"
                    >
                      <span className="text-lg font-bold text-accent">{juz}</span>
                      {info && (
                        <span className="text-[10px] text-text-muted">S. {info.surah_number}</span>
                      )}
                    </motion.button>
                  )
                })}
              </div>
            )}
          </>
        )}
      </div>
    </Drawer>
  )
}
