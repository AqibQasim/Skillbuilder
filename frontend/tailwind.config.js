/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      screens: {
        'xsm': {'max': '639px'},
      },
      colors: {
        customColor: '#F3F5FA', // Replace with your desired color code
      },
      borderRadius: {
        'tl-br': '180px 0 180px 0', // Adjust the pixel value as needed
      },
      container: {
        padding: "20px"
      }
    },
  },
  plugins: [],
}