/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      backdropBlur: {
        sm: '4px',
      },
      colors: {
        'card-glass': 'rgba(46, 46, 63, 0.6)',
      },
      keyframes: {
        'gold-shimmer': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '200% center' },
          '100%': { backgroundPosition: '-200% center' },
        },
      },
      animation: {
        'gold-shimmer': 'gold-shimmer 5s ease-in-out infinite',
        'shimmer': 'shimmer 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
} 