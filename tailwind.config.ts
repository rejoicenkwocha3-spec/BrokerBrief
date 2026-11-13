import type { Config } from 'tailwindcss'
const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        'forest': '#064B2E',
        'emerald-brand': '#079B65',
        'bright-green': '#10B981',
        'mint': '#E6F5EC',
        'soft-white': '#FAFAF8',
        'light-grey': '#F1F3F1',
        'charcoal': '#202923',
        'ai-purple': '#8154E8',
      },
      fontFamily: {
        'playfair': ['"Playfair Display"', 'Georgia', 'serif'],
        'inter': ['Inter', 'system-ui', 'sans-serif'],
        'dm': ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
