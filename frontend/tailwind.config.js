/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          dark: '#161049',
          black: '#0c0a20',
        },
        indigo: {
          DEFAULT: '#2b2378',
          light: '#332a8c',
        },
        appbg: '#dde3fb',
        ink: '#1c1a3a',
        muted: '#5c5a7a',
        faint: '#9b99b8',
        line: '#e6e8f7',
        good: '#25c281',
        bad: '#ef4b5f',
      },
      borderRadius: {
        xl2: '18px',
      },
      boxShadow: {
        soft: '0 10px 30px rgba(43,35,120,0.08)',
      },
    },
  },
  plugins: [],
}
