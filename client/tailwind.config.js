/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          primary: '#0d1117',
          secondary: '#161b22',
          tertiary: '#21262d',
          text: {
            primary: '#c9d1d9',
            secondary: '#8b949e',
          },
          border: '#30363d',
          accent: '#58a6ff',
          'accent-hover': '#79b8ff',
        },
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,0.08)"
      }
    },
  },
  darkMode: 'class',
  plugins: [],
}
