/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        amc: {
          dark: '#05080F',
          darker: '#0a0f18',
          teal: '#00D4AA',
          blue: '#0066FF',
          purple: '#667EEA',
          green: '#00D26A',
          orange: '#FF6B35',
          yellow: '#FFD93D',
          red: '#FF4757',
          pink: '#FF6B7A',
        }
      },
      fontFamily: {
        sans: ['SF Pro Display', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'slide-in': 'slideIn 0.5s ease-out forwards',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'spin-slow': 'spin 10s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
        fadeInUp: {
          'from': { opacity: '0', transform: 'translateY(20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          'from': { opacity: '0', transform: 'translateX(-20px)' },
          'to': { opacity: '1', transform: 'translateX(0)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(0.98)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glow-teal': '0 0 20px rgba(0, 212, 170, 0.3)',
        'glow-blue': '0 0 20px rgba(0, 102, 255, 0.3)',
        'glow-purple': '0 0 20px rgba(102, 126, 234, 0.3)',
        'glow-green': '0 0 20px rgba(0, 210, 106, 0.3)',
        'glow-red': '0 0 20px rgba(255, 71, 87, 0.3)',
      }
    },
  },
  plugins: [],
}
