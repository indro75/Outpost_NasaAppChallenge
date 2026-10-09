/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        space: {
          900: '#070B18',
          800: '#10182A',
          700: '#172238',
          600: '#1F2D4A'
        },
        cyan: { 400: '#55D6FF', 500: '#2FB8E6' },
        violet: { 400: '#8B7CFF', 500: '#6D5FE0' }
      },
      fontFamily: {
        sans: ['Inter', 'Space Grotesk', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        glow: '0 0 24px rgba(85, 214, 255, 0.25)',
        glowViolet: '0 0 24px rgba(139, 124, 255, 0.25)'
      }
    }
  },
  plugins: []
};