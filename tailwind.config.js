/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    darkMode: 'class',
    extend: {
      colors: {
        'dark-bg': '#181818',
        'glow': '#4A5568',
    },
    },
  },
  plugins: [],
}