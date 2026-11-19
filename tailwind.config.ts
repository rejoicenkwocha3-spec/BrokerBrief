import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: '#2047FF',
        'brand-dark': '#1538E0',
        charcoal: '#171717',
        surface: '#FAFAFC',
        line: '#E6E6EB',
        dim: '#777985',
        haze: '#EEF2FF',
        // Legacy aliases kept for smooth migration
        'light-bg': '#FAFAFC',
        'border-grey': '#E6E6EB',
        'soft-blue': '#EEF2FF',
      },
      fontFamily: {
        inter: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        dots: 'radial-gradient(circle, #E6E6EB 1px, transparent 1px)',
      },
      backgroundSize: {
        dots: '24px 24px',
      },
    },
  },
  plugins: [],
}

export default config
