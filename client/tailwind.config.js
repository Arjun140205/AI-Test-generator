/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        burgundy: {
          50: '#fdf2f4',
          100: '#fce8ec',
          200: '#f9d1d9',
          300: '#f4a3b4',
          400: '#ed6b86',
          500: '#e33d5f',
          600: '#c91d42',
          700: '#a91839',
          800: '#8d1733',
          900: '#78182f',
          950: '#430a17',
        },
        'dark-bg': '#0f0a0b',
        'dark-surface': '#1a1214',
        'dark-elevated': '#241a1c',
        'dark-border': '#2d1f22',
        'dark-text': '#f5e6e8',
        'dark-muted': '#a89193',
      },
      fontFamily: {
        heading: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out forwards',
        'slide-down': 'slideDown 0.3s ease-out forwards',
        'scale-in': 'scaleIn 0.2s ease-out',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2s infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(227, 61, 95, 0.3)' },
          '100%': { boxShadow: '0 0 20px rgba(227, 61, 95, 0.6)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
      boxShadow: {
        'glow-sm': '0 0 10px rgba(227, 61, 95, 0.3)',
        'glow-md': '0 0 20px rgba(227, 61, 95, 0.4)',
        'glow-lg': '0 0 30px rgba(227, 61, 95, 0.5)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.4)',
        'card-hover': '0 8px 30px rgba(0, 0, 0, 0.5)',
      },
      backgroundImage: {
        'gradient-burgundy': 'linear-gradient(135deg, #e33d5f 0%, #a91839 100%)',
        'gradient-dark': 'linear-gradient(180deg, #1a1214 0%, #0f0a0b 100%)',
        'shimmer': 'linear-gradient(90deg, transparent, rgba(227, 61, 95, 0.1), transparent)',
      },
    },
  },
  darkMode: 'class',
  plugins: [],
}
