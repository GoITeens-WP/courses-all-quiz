const { colors } = require(`tailwindcss/defaultTheme`);

module.exports = {
  content: ['./src/**/*.{html,js}'],
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    },
    fontFamily: {
      sans: ['Montserrat', 'sans-serif'],
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
          DEFAULT: '1rem',
          sm: '2rem',
          md: '2rem',
          lg: '2rem',
          xl: '1.4rem',
        },
        sm: '20px',
        md: '20px',
        lg: '40px',
        xl: '80px',
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
