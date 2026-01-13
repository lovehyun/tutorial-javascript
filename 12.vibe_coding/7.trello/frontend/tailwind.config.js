/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pastel: {
          blue: { 100: '#e0f2fe', 500: '#3b82f6' },
          green: { 100: '#dcfce7', 500: '#22c55e' },
          red: { 100: '#fee2e2', 500: '#ef4444' },
          purple: { 100: '#f3e8ff', 500: '#a855f7' },
          gray: { 50: '#f9fafb', 100: '#f3f4f6', 700: '#374151' },
        }
      }
    },
  },
  plugins: [],
}
