/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // ✅ Required for theme toggling
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
    require("tailwindcss-animate"),
  ],
}
