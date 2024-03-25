/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        'main-color': '#fff',
        'text-color': '#4E5058',
        'heading-color': '#060607',
        'form-background': '#EBEBEB',
        'form-second-background': '#F2F3F5',
      },
    },
  },
  plugins: [],
}