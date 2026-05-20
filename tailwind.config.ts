import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#120F0E',
          secondary: '#1A1613',
          card: '#1F1A17',
          elevated: '#251E1A',
          hover: '#2C2420',
        },
        accent: {
          DEFAULT: '#D4AF37',
          light: '#E8CA5A',
          dim: '#9A7D26',
          muted: 'rgba(212,175,55,0.15)',
        },
        text: {
          primary: '#F5F0E8',
          secondary: '#B8AD9E',
          muted: '#6B6259',
          arabic: '#F0E8D5',
        },
        error: {
          red: '#E53E3E',
          yellow: '#D69E2E',
        },
        success: '#38A169',
        border: {
          DEFAULT: 'rgba(212,175,55,0.12)',
          subtle: 'rgba(255,255,255,0.06)',
          strong: 'rgba(212,175,55,0.3)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        arabic: ['"Uthmanic Hafs"', '"KFGQPC Uthmanic Script HAFS"', '"Scheherazade New"', 'serif'],
        quran: ['"Uthmanic Hafs"', '"KFGQPC Uthmanic Script HAFS"', '"Amiri Quran"', 'serif'],
      },
      fontSize: {
        'arabic-sm': ['1.5rem', { lineHeight: '2.5rem' }],
        'arabic-md': ['2rem', { lineHeight: '3.2rem' }],
        'arabic-lg': ['2.5rem', { lineHeight: '4rem' }],
        'arabic-xl': ['3rem', { lineHeight: '5rem' }],
        'arabic-2xl': ['3.5rem', { lineHeight: '6rem' }],
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
      },
      boxShadow: {
        card: '0 2px 20px rgba(0,0,0,0.4)',
        'card-hover': '0 4px 32px rgba(0,0,0,0.6)',
        'accent-glow': '0 0 20px rgba(212,175,55,0.15)',
        'inner-warm': 'inset 0 1px 0 rgba(212,175,55,0.08)',
      },
      backgroundImage: {
        'gold-shimmer': 'linear-gradient(135deg, #D4AF37 0%, #E8CA5A 50%, #D4AF37 100%)',
        'card-gradient': 'linear-gradient(180deg, #1F1A17 0%, #1A1613 100%)',
        'warm-glow': 'radial-gradient(ellipse at top, rgba(212,175,55,0.08) 0%, transparent 60%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'slide-down': 'slideDown 0.3s ease-out',
        'ripple': 'ripple 0.6s ease-out',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        ripple: {
          '0%': { transform: 'scale(0)', opacity: '0.6' },
          '100%': { transform: 'scale(2.5)', opacity: '0' },
        },
        pulseGold: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
}

export default config
