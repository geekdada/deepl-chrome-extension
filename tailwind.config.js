module.exports = {
  purge: {
    enabled: true,
    content: ['./src/pages/**/*.{tsx,js}', './src/components/**/*.{tsx,js}'],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontSize: {
      xs: [remToPX(0.75), { lineHeight: remToPX(1) }],
      sm: [remToPX(0.875), { lineHeight: remToPX(1.25) }],
      base: [remToPX(1), { lineHeight: remToPX(1.5) }],
      lg: [remToPX(1.125), { lineHeight: remToPX(1.75) }],
      xl: [remToPX(1.25), { lineHeight: remToPX(1.75) }],
      '2xl': [remToPX(1.5), { lineHeight: remToPX(2) }],
      '3xl': [remToPX(1.875), { lineHeight: remToPX(2.25) }],
      '4xl': [remToPX(2.25), { lineHeight: remToPX(2.5) }],
      '5xl': [remToPX(3), { lineHeight: '1' }],
      '6xl': [remToPX(3.75), { lineHeight: '1' }],
      '7xl': [remToPX(4.5), { lineHeight: '1' }],
      '8xl': [remToPX(6), { lineHeight: '1' }],
      '9xl': [remToPX(8), { lineHeight: '1' }],
    },
    spacing: {
      px: '1px',
      0: '0px',
      0.5: remToPX(0.125),
      1: remToPX(0.25),
      1.5: remToPX(0.375),
      2: remToPX(0.5),
      2.5: remToPX(0.625),
      3: remToPX(0.75),
      3.5: remToPX(0.875),
      4: remToPX(1),
      5: remToPX(1.25),
      6: remToPX(1.5),
      7: remToPX(1.75),
      8: remToPX(2),
      9: remToPX(2.25),
      10: remToPX(2.5),
      11: remToPX(2.75),
      12: remToPX(3),
      14: remToPX(3.5),
      16: remToPX(4),
      20: remToPX(5),
      24: remToPX(6),
      28: remToPX(7),
      32: remToPX(8),
      36: remToPX(9),
      40: remToPX(10),
      44: remToPX(11),
      48: remToPX(12),
      52: remToPX(13),
      56: remToPX(14),
      60: remToPX(15),
      64: remToPX(16),
      72: remToPX(18),
      80: remToPX(20),
      96: remToPX(24),
    },
    borderRadius: {
      none: '0px',
      sm: remToPX(0.125),
      DEFAULT: remToPX(0.25),
      md: remToPX(0.375),
      lg: remToPX(0.5),
      xl: remToPX(0.75),
      '2xl': remToPX(1),
      '3xl': remToPX(1.5),
      full: '9999px',
    },
    extend: {},
  },
  variants: {
    extend: {
      backgroundColor: ['active'],
    },
  },
  plugins: [require('@tailwindcss/forms')],
}

/**
 * @param {number} num
 * @returns {string}
 */
function remToPX(num) {
  return num * 16 + 'px'
}
