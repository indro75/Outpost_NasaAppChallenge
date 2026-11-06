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
          600: '#1F2D4A',
          500: '#2A3C62'
        },
        cyan: { 400: '#55D6FF', 500: '#2FB8E6' },
        violet: { 400: '#8B7CFF', 500: '#6D5FE0' }
      },
      fontFamily: {
        sans: ['Inter', 'Space Grotesk', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        glow: '0 0 24px rgba(85, 214, 255, 0.35)',
        glowViolet: '0 0 24px rgba(139, 124, 255, 0.35)',
        glowEmerald: '0 0 24px rgba(52, 211, 153, 0.35)'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' }
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-8px) rotate(3deg)' }
        },
        twinkle: {
          '0%, 100%': { opacity: '0.2', transform: 'scale(0.8)' },
          '50%': { opacity: '0.9', transform: 'scale(1.2)' }
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(85, 214, 255, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(85, 214, 255, 0.65)' }
        }
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
        floatSlow: 'floatSlow 5s ease-in-out infinite',
        twinkle: 'twinkle 2.5s ease-in-out infinite',
        pulseGlow: 'pulseGlow 2s infinite'
      }
    }
  },
  plugins: []
};
