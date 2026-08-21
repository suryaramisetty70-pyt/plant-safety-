/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0a0f0d',
        card: 'rgba(18, 26, 22, 0.8)',
        emerald: {
          500: '#10b981',
          600: '#059669',
        },
        green: {
          400: '#4ade80',
          500: '#2ecc71',
        }
      },
      fontFamily: {
        heading: ['Outfit', 'sans-serif'],
        body: ['Plus Jakarta Sans', 'sans-serif'],
      }
    },
  },
  plugins: [],
};
