/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'menu': '0 12px 28px 0 rgba(0, 0, 0, 0.2)',
        'component': '0 1px 3px 0 rgba(0, 0, 0, 0.2)',
        'nav': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)'
      }
    },
    colors: {
      primary: 'rgba(67,83,240,255)',
      unconfirmedButton: 'rgba(67,83,240,.4)',
      white: 'rgb(255,255,255)',
      primaryText: 'rgb(0, 0, 0)',
      secondaryText: 'rgba(0,0,0,.6)',
      error: '#ff0033',
      secondaryOutline: 'rgba(0,0,0,.2)',
      primaryDivider: 'rgba(0,0,0,.1)',
      primaryBackground: 'rgb(242,242,242)',
      increase: '#037b4b',
      decrease: '#d60a22'
    }
  },
  plugins: [],
  darkMode: 'class',
}

