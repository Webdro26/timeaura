/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'ta-main':   '#0B0B0D',
        'ta-card':   '#141414',
        'ta-soft':   '#101014',
        'ta-gold':   '#C9A45C',
        'ta-gold-l': '#E2C07A',
        'ta-silver': '#C7C7C7',
        'ta-text':   '#F5F1E8',
        'ta-muted':  '#9B9B9B',
        'ta-dim':    '#5A5A5A',
        'ta-border': 'rgba(255,255,255,0.07)',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body:    ['"DM Sans"', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'float':    'float 4s ease-in-out infinite',
        'fade-up':  'fadeUp 0.8s ease forwards',
        'fade-in':  'fadeIn 0.6s ease forwards',
      },
      keyframes: {
        float:  { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        fadeUp: { from: { opacity: 0, transform: 'translateY(24px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
      },
    },
  },
  plugins: [],
}
