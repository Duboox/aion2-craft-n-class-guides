import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        aion: {
          950: '#070b14',
          900: '#0c1322',
          800: '#152039',
          700: '#1e2f53',
          gold: '#f5b942',
          cyan: '#38bdf8',
          emerald: '#10b981',
          crimson: '#f43f5e',
        },
      },
    },
  },
  plugins: [],
};

export default config;
