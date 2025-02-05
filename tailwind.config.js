/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#000000',
        secondary: '#666666',
        divider: '#e0e0e0',
        success: '#00C853',
        error: '#ff3b30',
      },
    },
  },
  plugins: [],
}; 