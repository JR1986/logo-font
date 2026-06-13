import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

export default <Config>{
  darkMode: 'class',
  content: [
    './app/components/**/*.{js,vue,ts}',
    './app/layouts/**/*.vue',
    './app/pages/**/*.vue',
    './app/plugins/**/*.{js,ts}',
    './app/app.vue',
    './app/error.vue'
  ],
  theme: {
    extend: {
      colors: {
        // Warm editorial palette (fontpair-inspired)
        paper: '#F4F2EC',
        cream: '#FBFAF7',
        ink: {
          DEFAULT: '#141413',
          soft: '#3D3D38'
        },
        sun: {
          DEFAULT: '#FFC700',
          deep: '#EFB300',
          tint: '#FFF3C2'
        },
        coral: {
          DEFAULT: '#FF5436',
          deep: '#E83D20'
        }
      },
      fontFamily: {
        sans: ['Satoshi', ...defaultTheme.fontFamily.sans],
        serif: ['Sentient', 'Georgia', 'serif']
      },
      boxShadow: {
        dock: '0 16px 48px -16px rgba(20, 20, 19, 0.28), 0 2px 8px -2px rgba(20, 20, 19, 0.10)',
        card: '0 1px 2px rgba(20, 20, 19, 0.05), 0 10px 28px -14px rgba(20, 20, 19, 0.16)',
        pop: '0 24px 64px -20px rgba(20, 20, 19, 0.35), 0 4px 12px -4px rgba(20, 20, 19, 0.12)'
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'pop-in': {
          '0%': { opacity: '0', transform: 'translateY(10px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' }
        }
      },
      animation: {
        'fade-up': 'fade-up 0.35s cubic-bezier(0.22, 1, 0.36, 1) both',
        'pop-in': 'pop-in 0.22s cubic-bezier(0.22, 1, 0.36, 1) both'
      }
    }
  },
  plugins: []
}
