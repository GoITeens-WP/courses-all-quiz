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
      // xxl: '1600px', // (goiteens)
      smOnly: { max: '767.98px' },
      mdOnly: { min: '768px', max: '1279.98px' },
      notXl: { max: '1279.98px' },
    },
    // FONTS
    fontFamily: {
      // montserrat: ['Montserrat', 'sans-serif'], // class="font-montserrat"
      gotham: ['Gotham', 'sans-serif'], // class="font-gotham" (goiteens)
      IBMPlexMono: ['IBMPlexMono', 'sans-serif'], // class="font-IBMPlexMono" (goiteens)
      IBMPlexSans: ['IBMPlexSans', 'sans-serif'], // class="font-IBMPlexSans" (goiteens)
      // exo: ['"Exo 2"', 'sans-serif'],
    },
    // THEME
    extend: {
      // CONTAINER
      container: {
        center: true,
        padding: {
          DEFAULT: '1.5rem', // 1.25rem (goiteens)
          sm: '1.5rem', // 1.25rem (goiteens)
          md: '2rem', // 2rem (goiteens)
          xl: '2rem', // 2.5rem (goiteens)
          // xxl: '3.5rem', // (goiteens)
        },
      },
      backgroundColor: theme => ({
        ...theme('colors'),
      }),
      backgroundImage: {
        check: "url('../images/components/agree-checkbox.svg')", // class="bg-check"
      },
      // ALL COLORS
      colors: {
        body: '#ffffff', // class="bg-body"
        black: {
          DEFAULT: '#000000', // class="bg-black text-black border-black"
          // '01': '#010101', // bg-black-01 text-black-01 border-black-01
          // '20': '#202020', // bg-black-20 text-black-20 border-black-20
          // '1A': '#1A1A1A', // bg-black-1A text-black-1A border-black-1A
          // '47': '#474747', // bg-black-47 text-black-47 border-black-47
          // '6E': '#6E6E6E', // bg-black-6E text-black-6E border-black-6E
        },
        white: {
          DEFAULT: '#ffffff', // class="bg-white text-white border-white"
          // fa: '#fafafa', // bg-white-fa text-white-fa border-white-fa
        },
        accent: {
          DEFAULT: '#FF6C00', // class="bg-accent text-accent border-accent"
        }
      },
    },
  },
  plugins: [],
};
