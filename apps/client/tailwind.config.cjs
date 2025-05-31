/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#9b59b6',
        secondary: '#8e44ad',
        background: '#1e1e2f',
      }
    },
  },
  plugins: [],
}