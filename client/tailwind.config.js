/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f6ff',
          100: '#e0edff',
          200: '#bcd7ff',
          300: '#84b5ff',
          400: '#438eff',
          500: '#3D81E3', // Blue accent
          600: '#1d5ecf',
          700: '#154aa6',
          800: '#163f87',
          900: '#18366c',
          950: '#0f2044',
        },
        dark: {
          bg: '#0c0c0c',  // Fullscreen cinematic black
          card: '#141414', // Slightly lighter for cards
          border: 'rgba(255, 255, 255, 0.08)',
          text: '#f3f4f6',
        },
      },
      fontFamily: {
        inter: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        fadeIn: 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        slideUp: 'slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        slideIn: 'slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        float: 'float 6s ease-in-out infinite',
        marquee: 'marquee 40s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', filter: 'blur(4px)' },
          '100%': { opacity: '1', filter: 'blur(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)', filter: 'blur(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)', filter: 'blur(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
};
