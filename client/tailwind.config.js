/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef8ff',
          100: '#d9efff',
          200: '#b9e1ff',
          300: '#86ccff',
          400: '#4bb0ff',
          500: '#1a8cff',
          600: '#0f6fe6',
          700: '#1057b9',
          800: '#134b95',
          900: '#143f7a',
          950: '#0e2549',
        },
      },
      boxShadow: {
        soft: '0 10px 30px rgba(2, 6, 23, 0.10)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

