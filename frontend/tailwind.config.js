/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          500: '#ef4444',
          600: '#dc2626',
        },
        dark: {
          900: '#0f0f0f',
          800: '#181818',
          700: '#222222',
          600: '#282828',
          500: '#3f3f3f',
        }
      }
    },
  },
  plugins: [],
}
