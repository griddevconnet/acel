/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    screens: {
      xs: '420px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1440px',
    },
    extend: {
      colors: {
        // Exact values sampled from the official ACEL logo (navy ring,
        // gold ring, green trend-line). Do not adjust without checking
        // against the source mark in public/logo.png.
        ink: {
          DEFAULT: '#00142D', // logo outer ring / navy
          soft: '#1F3046',
          faint: '#38485B',
        },
        paper: {
          DEFAULT: '#FFFFFF', // logo background — pure white
          dim: '#F2F2F2',
        },
        gold: {
          DEFAULT: '#C37C0C', // logo inner ring / dot
          bright: '#D09941',
          deep: '#8C5909',
        },
        emerald: {
          DEFAULT: '#047622', // logo trend line
          bright: '#3B9453',
          deep: '#035318',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        body: ['"IBM Plex Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '10xl': ['9rem', { lineHeight: '0.92' }],
      },
      backgroundImage: {
        'ring-lines': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240' viewBox='0 0 240 240'%3E%3Ccircle cx='120' cy='120' r='118' fill='none' stroke='%23C37C0C' stroke-opacity='0.18'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        'draw-ring': {
          '0%': { strokeDashoffset: 'var(--ring-len)' },
          '100%': { strokeDashoffset: '0' },
        },
      },
    },
  },
  plugins: [],
}
