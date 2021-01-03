module.exports = {
  purge: ['./src/pages/**/*.{tsx,js}', './src/components/**/*.{tsx,js}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms')],
}
