const { colors } = require(`tailwindcss/defaultTheme`);

module.exports = {
  content: ['./src/**/*.{html,js}'],
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
    },
    fontFamily: {
      sans: ['Montserrat', 'sans-serif'],
    },

    extend: {
      backgroundColor: theme => ({
        ...theme('colors'),
        primary: '#456FAB',
        secondary: '#ffffff',
        main: '#f8f8ff',
      }),
      colors: {
        primary: colors.emerald,
      },
      container: {
        center: true,
        padding: {
          default: '1rem',
          sm: '0.5rem',
          md: '2rem',
          lg: '3.5rem',
          xl: '5rem',
        },
      },
      keyframes: {
        side: {
          '0%, 100%': { transform: 'translateX(25%)' },
          '50%': { transform: ' translateY(0)' },
        },
      },
      animation: {
        side: 'side 1s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
