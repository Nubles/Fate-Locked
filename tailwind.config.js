/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        osrs: {
          bg: '#1e1e1e', // Dark Grey
          panel: '#2d2d2d',
          gold: '#ffff00', // Classic OSRS Gold
          red: '#ff0000', // Locked/Danger
          green: '#00ff00', // Unlocked/Success
          text: '#d1d5db', // Light grey text
        }
      },
      fontFamily: {
        sans: ['"RuneScape UF"', 'sans-serif'], // Ideally we'd have a custom font, but sans-serif fallback works
      }
    },
  },
  plugins: [],
}
