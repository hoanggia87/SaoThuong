/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Baloo 2"', 'system-ui', 'sans-serif'],
      },
      colors: {
        candy: {
          pink: '#ff6fa3',
          purple: '#b760ff',
          blue: '#5ec8ff',
          yellow: '#ffd64a',
          green: '#5fe0a8',
          orange: '#ff995c',
        },
      },
      boxShadow: {
        toy: '0 8px 0 rgba(0,0,0,0.12), 0 12px 24px rgba(0,0,0,0.12)',
        'toy-sm': '0 4px 0 rgba(0,0,0,0.12), 0 6px 12px rgba(0,0,0,0.12)',
      },
      keyframes: {
        wiggle: {
          '0%,100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2deg)' },
        },
        pop: {
          '0%': { transform: 'scale(0.6)', opacity: '0' },
          '60%': { transform: 'scale(1.15)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        wiggle: 'wiggle 0.6s ease-in-out infinite',
        pop: 'pop 0.4s ease-out',
      },
    },
  },
  plugins: [],
}
