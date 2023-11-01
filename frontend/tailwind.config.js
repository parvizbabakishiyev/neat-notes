/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme';
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Mulish', ...defaultTheme.fontFamily.sans],
      },
      screens: {
        xxs: '320px',
        xs: '425px',

        // => @media (min-width: 320px) { ... }
      },
      colors: {
        // note colors
        ice: '#b9f3fc',
        'dark-ice': '#0f6f8f',
        ocean: '#d2e9e9',
        'dark-ocean': '#345156',
        candy: '#ffd1d1',
        'dark-candy': '#811b1b',
        lavander: '#dcd6f7',
        'dark-lavander': '#512f83',
        sand: '#ffdca9',
        'dark-sand': '#7c4903',
        vanilla: '#f5f0bb',
        'dark-vanilla': '#8e6e26',
        seaglass: '#9ee6cf',
        'dark-seaglass': '#19564c',
        coffee: '#e8ded2',
        'dark-coffee': '#593e35',
        coral: '#f8b195',
        'dark-coral': '#95401f',
        olive: '#dce8ba',
        'dark-olive': '#4f6427',
        silver: '#ececec',
        'dark-silver': '#525252',
        'primary-green': {
          50: '#f2f7f2',
          100: '#e1edde',
          200: '#bbd6b8', // main
          300: '#96c095',
          400: '#67a067',
          500: '#478249',
          600: '#346736',
          700: '#2a522d',
          800: '#234225',
          900: '#1d371f',
          950: '#101e12',
        },
        'cerise-red': {
          50: '#fef2f4',
          100: '#fde6e9',
          200: '#fbd0d9',
          300: '#f7aab9',
          400: '#f27a93',
          500: '#e63f66', // main
          600: '#d42a5b',
          700: '#b21e4b',
          800: '#951c45',
          900: '#801b40',
          950: '#470a1f',
        },
      },
      boxShadow: {
        s1: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px',
        s1d: 'inset 1px 1px 0 rgba(0,0,0,.1), inset 0 -1px 0 rgba(0,0,0,.07)',
      },
    },
  },
  plugins: [],
};
