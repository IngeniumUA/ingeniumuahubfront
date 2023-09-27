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
      }
    },
  },
  plugins: [],
}

