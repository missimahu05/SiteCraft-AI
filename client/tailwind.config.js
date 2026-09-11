/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#1A2550',
          dark: '#0F163A',
          light: '#2A3870',
          pale: '#E8EAF2',
        },
        accent: {
          DEFAULT: '#C41641',
          dark: '#A01235',
          light: '#E03E64',
          pale: '#FDF1F3',
        },
        sand: {
          DEFAULT: '#F4F2EE',
          alt: '#FAF9F6',
          border: '#E0E3EF',
        },
        ink: '#0D1221',
        content: '#2D3553',
        muted: '#6B7299',
        borderline: '#E0E3EF',
        gold: '#FBBF24',
        emerald: '#10B981',
      },
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'accent': '0 10px 25px rgba(196, 22, 65, 0.25)',
        'accent-lg': '0 15px 35px rgba(196, 22, 65, 0.4)',
        'navy': '0 12px 36px rgba(26, 37, 80, 0.12)',
        'card': '0 8px 28px rgba(13, 18, 33, 0.08)',
        'card-hover': '0 16px 48px rgba(13, 18, 33, 0.14)',
      },
      animation: {
        'float-pulse': 'float-pulse 7s infinite ease-in-out',
        'shimmer': 'shimmer 2.5s infinite',
        'marquee': 'marquee 25s linear infinite',
      },
      keyframes: {
        'float-pulse': {
          '0%': { transform: 'translate(0, 0) scale(1)', opacity: '0.4' },
          '50%': { transform: 'translate(30px, -30px) scale(1.3)', opacity: '0.8' },
          '100%': { transform: 'translate(-15px, 15px) scale(1)', opacity: '0.4' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        }
      }
    },
  },
  plugins: [],
}
