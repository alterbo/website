/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{njk,md,html,js}'
  ],
  theme: {
    screens: {
      xs: '36rem',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    },
    extend: {}
  },
  plugins: []
};
