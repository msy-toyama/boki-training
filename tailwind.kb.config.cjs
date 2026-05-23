/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./public/kb/**/*.html'],
  theme: {
    extend: {
      colors: {
        slate: {
          350: '#cbd5e1',
          750: '#273449',
          850: '#162033',
        },
        indigo: {
          350: '#8da2fb',
        },
        purple: {
          350: '#c084fc',
        },
      },
    },
  },
  plugins: [],
};