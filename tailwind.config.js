/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          50:  '#FBFAF6',
          100: '#F6F2E8',
          200: '#EFE9D8',
          300: '#E5DEC8',
          400: '#D8CFB8',
        },
        ink: {
          DEFAULT: '#1A1815',
          soft:    '#3A3631',
          mute:    '#6B6660',
          line:    '#D8D2C4',
        },
        clay: {
          DEFAULT: '#CC785C',
          hover:   '#B8634A',
          soft:    '#E5A38B',
          tint:    '#F4D9CC',
        },
      },
      fontFamily: {
        serif: ['"Tiempos Headline"', 'Tiempos', 'Copernicus', 'ui-serif', 'Georgia', 'serif'],
        sans:  ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono:  ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      maxWidth: {
        prose: '720px',
        wide:  '1280px',
      },
      borderRadius: {
        DEFAULT: '6px',
        lg: '12px',
        xl: '16px',
      },
      animation: {
        'fade-in': 'fadeIn .3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(4px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
