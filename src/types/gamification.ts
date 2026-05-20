export interface Streak {
  current_streak: number
  longest_streak: number
  last_activity_date: string | null
  total_active_days: number
  freeze_count: number
}

export interface TasbihDhikr {
  id: number
  text_arabic: string
  text_transliteration: string
  text_en: string
  text_ru: string
  text_uz: string
  default_target: number
}

export interface TasbihSession {
  id: number
  dhikr: TasbihDhikr
  dhikr_id?: number
  count: number
  target: number
  completed: boolean
  created_at: string
  completed_at: string | null
}

export interface TasbihIncrementResponse {
  count: number
  target: number
  completed: boolean
  remaining: number
}

export type AchievementRarity = 'common' | 'rare' | 'epic' | 'legendary'

export interface Achievement {
  id: number
  key: string
  name: string
  description: string
  icon: string
  rarity: AchievementRarity
  condition_type: string
  condition_value: number
  xp_reward: number
}

export interface UserAchievement {
  id: number
  achievement: Achievement
  earned_at: string
}

export interface GamificationDashboard {
  streak: Streak
  tasbih_completed_today: number
  achievements_earned: number
  achievements_total: number
}
