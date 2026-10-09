import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './features/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        maroon: 'var(--color-maroon)',
        gold: 'var(--color-gold)',
        ivory: 'var(--color-ivory)',
        blush: 'var(--color-blush)',
        ink: 'var(--color-ink)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        hindi: ['var(--font-hindi)', 'serif'],
      },
    },
  },
  plugins: [],
};

export default config;
