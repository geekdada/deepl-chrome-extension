module.exports = {
  purge: {
    enabled: true,
    content: ['./src/pages/**/*.{tsx,js}', './src/components/**/*.{tsx,js}'],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      backgroundColor: ['active'],
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
