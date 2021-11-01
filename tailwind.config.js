const colors = require('tailwindcss/colors');

/**
 * @type {import("tailwindcss/tailwind-config").TailwindConfig}
 */
module.exports = {
  important: true,
  prefix: '',
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    content: ['./src/**/*.{html,ts}']
  },
  mode: 'aot',
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      ...colors,
      // InnoHub Blue
      blue: {
        50: '#e6eaf4',
        100: '#c0cbe3',
        200: '#96a9d0',
        300: '#6c86bd',
        400: '#4d6cae',
        500: '#2d52a0',
        600: '#284b98',
        700: '#22418e',
        800: '#1c3884',
        900: '#112873'
      },
      // InnoHub Berry
      berry: {
        50: '#f6e6f2',
        100: '#e9c1de',
        200: '#da98c9',
        300: '#cb6eb3',
        400: '#bf4fa2',
        500: '#9b1868',
        600: '#ad2b8a',
        700: '#a4247f',
        800: '#9c1e75',
        900: '#8c1363'
      },
      // InnoHub Light Blue
      sky: {
        50: '#e0f3fc',
        100: '#b3e2f7',
        200: '#80cff1',
        300: '#4dbceb',
        400: '#26ade7',
        500: '#009fe3',
        600: '#0097e0',
        700: '#008ddc',
        800: '#0083d8',
        900: '#0072d0'
      }
    },
    extend: theme => ({
      colors: {
        primary: theme('colors.blue'),
        secondary: theme('colors.berry'),
        neutral: theme('colors.sky')
      }
    })
  },
  variants: {
    extend: {
      backgroundColor: ['odd']
    }
  },
  plugins: []
};
