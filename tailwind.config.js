const colors = require('tailwindcss/colors');

const ihbrBlue = {
  50: '#e6eaf4',
  100: '#c0cbe3',
  200: '#96a9d0',
  300: '#6c86bd',
  400: '#4d6cae',
  500: '#2d52a0',
  600: '#284b98',
  700: '#22418e',
  800: '#1c3884',
  900: '#112873',
  DEFAULT: '#2d52a0'
};
const ihbrBerry = {
  50: '#f6e6f2',
  100: '#e9c1de',
  200: '#da98c9',
  300: '#cb6eb3',
  400: '#bf4fa2',
  500: '#9b1868',
  600: '#ad2b8a',
  700: '#a4247f',
  800: '#9c1e75',
  900: '#8c1363',
  DEFAULT: '#9b1868'
};
const ihbrSky = {
  50: '#e0f3fc',
  100: '#b3e2f7',
  200: '#80cff1',
  300: '#4dbceb',
  400: '#26ade7',
  500: '#009fe3',
  600: '#0097e0',
  700: '#008ddc',
  800: '#0083d8',
  900: '#0072d0',
  DEFAULT: '#009fe3'
};

/**
 * @type {import('tailwindcss/tailwind-config').TailwindConfig}
 */
module.exports = {
  important: true,
  prefix: '',
  content: ['./src/**/*.{html,ts}'],
  daisyui: {
    themes: [
      {
        innohub: {
          primary: ihbrBerry.DEFAULT,
          secondary: ihbrBlue.DEFAULT,
          accent: ihbrSky.DEFAULT,
          neutral: '#2c2c2c',
          'base-100': '#FFFFFF',
          info: '#6599CD',
          success: '#0D6D32',
          warning: '#FBA83C',
          error: '#ED2630'
        }
      }
    ]
  },
  theme: {
    extend: {
      colors: {
        // InnoHub Blue
        blue: ihbrBlue,
        // InnoHub Berry
        berry: ihbrBerry,
        // InnoHub Light Blue
        sky: ihbrSky,
        primary: ihbrBerry.DEFAULT,
        secondary: ihbrBlue.DEFAULT,
        accent: ihbrSky.DEFAULT
      },
      screens: {
        '3xl': '1921px'
      },
      fontFamily: {
        sans: ['Roboto', 'Helvetica', 'Arial', 'sans-serif']
      }
    },
    variants: {
      extend: {
        backgroundColor: ['odd']
      }
    }
  },
  plugins: [require('@tailwindcss/aspect-ratio'), require('daisyui')]
};
