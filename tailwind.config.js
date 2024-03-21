import defaultTheme from 'tailwindcss/defaultTheme'
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,jsx,tsx}",
  ],
  theme: {
    screens: {
      'xs': '375px',
      's' : '500px',
      ...defaultTheme.screens,
    },
    extend: {
     gridTemplateRows: {
      layout: '70px 1fr 60px',
      layout_pricing : '60px 200px 1fr',
     },
    },
  },
  plugins: [],
}