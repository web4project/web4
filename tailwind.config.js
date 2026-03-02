/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        accent: '#9EFB4F',
        'accent-dim': '#7DC93E',
        surface: '#0A0A0A',
        'surface-2': '#0D0D0D',
        'surface-3': '#141414',
        border: '#1A1A1A',
        'border-2': '#242424',
        text: '#EDEDED',
        'text-muted': '#888888',
        'text-dim': '#555555',
        success: '#4CAF50',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'accent-glow': '0 0 20px rgba(158, 251, 79, 0.25)',
        'accent-glow-sm': '0 0 10px rgba(158, 251, 79, 0.15)',
        'card': '0 1px 3px rgba(0,0,0,0.8)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.2s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        pulseSoft: { '0%,100%': { opacity: '1' }, '50%': { opacity: '0.6' } },
      },
    },
  },
  plugins: [],
};
