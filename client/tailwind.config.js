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
      errorText: '#ff0033',
      secondaryOutline: 'rgba(0,0,0,.2)',
    }
  },
  plugins: [],
  darkMode: 'class',
}

