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
          dark: '#0B1128',
          deep: '#070C1E',
          light: '#2E3D78',
          pale: '#EEF2FF',
        },
        accent: {
          DEFAULT: '#C41641',
          dark: '#9E0E32',
          light: '#E62E5A',
          pale: '#FFF0F3',
          glow: 'rgba(196, 22, 65, 0.35)',
        },
        cyber: {
          cyan: '#06B6D4',
          emerald: '#10B981',
          amber: '#F59E0B',
          violet: '#8B5CF6',
          slate: '#0F172A',
        },
        surface: {
          canvas: '#0A0F1D',
          dark: '#0F172A',
          card: '#131D33',
          cardHover: '#1A2644',
          elevated: '#1E293B',
          border: 'rgba(255, 255, 255, 0.08)',
          borderHover: 'rgba(255, 255, 255, 0.18)',
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
        'cyber-cyan': '0 0 25px rgba(6, 182, 212, 0.25)',
        'cyber-emerald': '0 0 25px rgba(16, 185, 129, 0.25)',
        'glow-red': '0 0 30px rgba(196, 22, 65, 0.3)',
        'card': '0 8px 28px rgba(13, 18, 33, 0.08)',
        'card-hover': '0 16px 48px rgba(13, 18, 33, 0.14)',
      },
      animation: {
        'float-pulse': 'float-pulse 7s infinite ease-in-out',
        'shimmer': 'shimmer 2.5s infinite',
        'marquee': 'marquee 28s linear infinite',
        'pulse-subtle': 'pulse-subtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'float-pulse': {
          '0%': { transform: 'translate(0, 0) scale(1)', opacity: '0.4' },
          '50%': { transform: 'translate(20px, -20px) scale(1.2)', opacity: '0.7' },
          '100%': { transform: 'translate(-10px, 10px) scale(1)', opacity: '0.4' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        'pulse-subtle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
    },
  },
  plugins: [],
}
