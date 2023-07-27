/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        "green-100":"#F0FDF4"
      }
    },
    screens: {
      'xs': '500px',
      'sm': '640px',
      'md': '780px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl':'1440px',
    },

  },
  plugins: [],
}