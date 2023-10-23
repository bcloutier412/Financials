/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    colors: {
      primary: 'rgba(67,83,240,255)',
      unconfirmedButton: 'rgba(67,83,240,.4)',
      white: 'rgb(255,255,255)',
      primaryText: 'rgb(0, 0, 0)',
      secondaryText: 'rgba(0,0,0,.6)',
      error: '#ff0033',
      secondaryOutline: 'rgba(0,0,0,.2)',
      primaryDivider: 'rgba(0,0,0,.1)'
    }
  },
  plugins: [],
  darkMode: 'class',
}

