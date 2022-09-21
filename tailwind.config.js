const { colors } = require(`tailwindcss/defaultTheme`);

module.exports = {
  content: ['./src/**/*.{html,js}'],
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      xl: '1280px',
    },
    fontFamily: {
      montserrat: ['Montserrat', 'sans-serif'],
    },

    extend: {
      backgroundColor: theme => ({
        ...theme('colors'),
        body: '#FFF8EF',
      }),
      colors: {
        orange: '#FF6C00',
        black: '#202020',
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1.25rem',
          sm: '1.25rem',
          md: '2rem',
          xl: '2.5rem',
        },
        sm: '20px',
        md: '32px',
        xl: '40px',
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
