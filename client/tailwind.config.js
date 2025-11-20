/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#0a0e27',
        'dark-secondary': '#1a1f3a',
        'accent-green': '#00ff88',
        'accent-red': '#ff3366',
        'accent-blue': '#3366ff',
      },
    },
  },
  plugins: [],
}
