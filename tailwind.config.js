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
          50: '#fdf8f4',
          100: '#faefe6',
          200: '#f4decb',
          300: '#eac5a4',
          400: '#dea374',
          500: '#cf7b3e', // Warm artisanal copper / terracotta
          600: '#b8612b',
          700: '#954924',
          800: '#793b22',
          900: '#64321f',
        },
        vault: {
          dark: '#141414',
          card: '#1e1e1e',
          gold: '#d4af37',
          parchment: '#fcfbf7',
        }
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'serif'],
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'book': '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
        'kindle': 'inset 0 0 40px rgba(0,0,0,0.06), 0 8px 30px rgba(0,0,0,0.25)',
      }
    },
  },
  plugins: [],
}

