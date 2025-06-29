/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'warm-white': '#FFFBEA',
        'navy': '#003366',
        'blue-accent': '#4A90E2',
        'success-green': '#22C55E',
        'warning-amber': '#F59E0B',
        'error-red': '#EF4444',
      },
      fontSize: {
        'elderly-base': ['18px', '1.6'],
        'elderly-lg': ['20px', '1.5'],
        'elderly-xl': ['22px', '1.4'],
        'elderly-2xl': ['26px', '1.3'],
        'elderly-3xl': ['32px', '1.2'],
      },
      fontFamily: {
        'sans': ['Inter', 'Arial', 'Helvetica', 'sans-serif'],
      },
    },
  },
  plugins: [],
};