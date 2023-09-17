/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        'topleft-color':"#151515",
        'middle-color':"#6E5E58",
        'bottomright-color':"#241212",
        "dark-blue":"#3F1D38",
      },
    },
  },
  plugins: [],
}

