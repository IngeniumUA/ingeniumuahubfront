/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'blue': {
          '50': '#e4f1ff',
          '100': '#cfe4ff',
          '200': '#a8ccff',
          '300': '#74a8ff',
          '400': '#3e71ff',
          '500': '#133bff',
          '600': '#0025ff',
          '700': '#0025ff',
          '800': '#0021e4',
          '900': '#1f2980', // Ingenium blue
          '950': '#00053d', // Main blue
        },
        'ingenium-grey': {
          '50': '#f4f6fa',
          '100': '#e7ebf2',
          '200': '#d4dbe9', // Ingenium grey
          '300': '#b6c3da',
          '400': '#93a4c7',
          '500': '#798ab8',
          '600': '#6775a9',
          '700': '#5b659a',
          '800': '#4e557f',
          '900': '#424766',
          '950': '#2b2e40',
        },
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
