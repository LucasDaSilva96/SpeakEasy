import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    colors: {
      blue: '#168AFF',
      purple: '#9F33FF',
      white: '	#FFFFFF',
      red: '#FF6070',
    },
  },
  plugins: [],
};
export default config;
