const { colors } = require(`tailwindcss/defaultTheme`);

module.exports = {
  content: ['./src/**/*.{html,njk,js,json}'],
  theme: {
    // MEDIA QUERIES
    screens: {
      // xs: '375px', // (goiteens)
      sm: '480px',
      md: '768px',
      xl: '1280px',
      xxl: '1600px', // (goiteens)
      smOnly: { max: '767.98px' },
      mdOnly: { min: '768px', max: '1279.98px' },
      notXl: { max: '1279.98px' },
    },
    safelist: [ "translate-x-[-100%]",
      "hidden", "right-[-100%]", "min-h-[1140px]", "min-h-[888px]", "xl:h-[80vh]", "xl:h-[720px]"
    ],
    // FONTS
    fontFamily: {
      // montserrat: ['Montserrat', 'sans-serif'], // class="font-montserrat"
      gotham: ['Gotham', 'sans-serif'], // class="font-gotham" (goiteens)
      IBMPlexMono: ['IBMPlexMono', 'monospace'], // class="font-IBMPlexMono" (goiteens)
      IBMPlexSans: ['IBMPlexSans', 'sans-serif'], // class="font-IBMPlexSans" (goiteens)
      // exo: ['"Exo 2"', 'sans-serif'],

      Inter: ['Inter', 'sans-serif'],
    },
    // THEME
    extend: {
      // CONTAINER
      container: {
        center: true,
        padding: {
          DEFAULT: '1.25rem', // 1.25rem (goiteens)
          sm: '1.25rem', // 1.25rem (goiteens)
          md: '2rem', // 2rem (goiteens)
          xl: '2.5rem', // 2.5rem (goiteens)
          xxl: '3.5rem', // (goiteens)
        },
      },
      backgroundColor: theme => ({
        ...theme('colors'),
      }),
      backgroundImage: {
        check: "url('../images/components/agree-checkbox.svg')", // class="bg-check"
      },
      boxShadow: {

        header: "0px 1px 3px 0px rgba(0, 0, 0, 0.20)"

      },
      // ALL COLORS
      colors: {
        body: '#ffffff', // class="bg-body"
        black: {
          DEFAULT: '#000000', // class="bg-black text-black border-black"
          // '01': '#010101', // bg-black-01 text-black-01 border-black-01
          20: '#202020', // bg-black-20 text-black-20 border-black-20
          '1A': '#1A1A1A', // bg-black-1A text-black-1A border-black-1A
          // '47': '#474747', // bg-black-47 text-black-47 border-black-47
          // '6E': '#6E6E6E', // bg-black-6E text-black-6E border-black-6E
        },
        white: {
          DEFAULT: '#ffffff', // class="bg-white text-white border-white"
          // fa: '#fafafa', // bg-white-fa text-white-fa border-white-fa
        },
        accent: {
          DEFAULT: '#653CD9', // class="bg-accent text-accent border-accent"
        },
        error: '#E53935',
        success: {
          main: '#82B232',
          highlight: '#587A1F',
        },
        lilac: {
          10: '#EBE6FA',
          50: '#C2B0F5',
          100: '#A38AED',
          200: '#8160E0',
          300: '#653CD9',
          400: '#5331B2',
          450: '#452994',
          500: '#361F7A',
          600: '#2B195C',
        },
        gray: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          150: '#EDEDED',
          300: '#E0E0E0',
          400: '#D6D6D6',
          500: '#999999',
          600: '#6E6E6E',
          800: '#474747',
          900: '#1A1A1A',
        },
        scarlet: {
          10: '#FAE8E6',
          50: '#F5BFB8',
          100: '#F0A095',
          200: '#EB7F71',
          300: '#E05744',
          400: '#C74736',
          450: '#B24132',
          500: '#8A2F22',
          600: '#66251D',
        },
        yellow: {
          10: '#FAF5E6',
          50: '#F5E3AB',
          100: '#F5D87A',
          200: '#F0CD60',
          300: '#FEC830',
          400: '#E0AB00',
          450: '#CC9B00',
          500: '#B28800',
          600: '#997500',
        },
        ochre: {
          10: '#FAEEE6',
          50: '#F5D1B8',
          100: '#F0B890',
          200: '#EBA371',
          300: '#E58845',
          400: '#E0782D',
          450: '#CC6821',
          500: '#B25919',
          600: '#99490F',
        },
        green: {
          10: '#F2FAE6',
          50: '#DBF5B0',
          100: '#C7ED8A',
          200: '#B0E061',
          300: '#97CB43',
          400: '#82B232',
          450: '#6B9429',
          500: '#587A1F',
          600: '#435C1A',
        },
        aqua: {
          10: '#E6F2FA',
          50: '#B8DBF5',
          100: '#90C8F0',
          200: '#71B8EB',
          300: '#479FDE',
          400: '#3B92D1',
          450: '#327DB2',
          500: '#225F8A',
          600: '#1D4766',
        },
        purple: {
          DEFAULT: '#5331B2',
        },
        pink: {
          10: '#FAE6F3',
          50: '#F5BAE2',
          100: '#ED8ACD',
          200: '#E060B7',
          300: '#E03EAB',
          400: '#B23188',
          450: '#942971',
          500: '#7A225D',
          600: '#5C1A46',
        },
        navy: {
          10: '#E6EAFA',
          50: '#B8C3F5',
          100: '#90A1F0',
          200: '#5A6FCC',
          300: '#2E43A4',
          400: '#27398A',
          450: '#213075',
          500: '#162257',
          600: '#101738',
        },
        turquoise: {
          10: '#E9F9F8',
          50: '#C2FFFB',
          100: '#8AEDE8',
          200: '#56C7C1',
          300: '#0C7D77',
          400: '#1F706C',
          450: '#1A5C58',
          500: '#124A47',
          600: '#103836',
        },
      },
    },
  },
  plugins: [],
};
