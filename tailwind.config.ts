import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand — lime stays vivid on dark
        lime: {
          DEFAULT: '#A8E63D',   // bright lime for dark bg
          bright:  '#BFFF4F',
          light:   '#1A2A00',   // dark tint for backgrounds / tags
          tag:     '#1E3000',
        },
        purple: {
          brand: '#9B7FE8',
          light: '#B49EF0',
          dark:  '#7A5FD0',
          tint:  '#1E1540',    // dark tint
        },
        // Dark theme surfaces
        surface: {
          DEFAULT:   '#111111',
          secondary: '#0A0A0A',
          tertiary:  '#1A1A1A',
          border:    '#2A2A2A',
          hover:     '#222222',
        },
        // Text on dark
        ink: {
          DEFAULT: '#F0F0F0',
          muted:   '#A0A0A0',
          faint:   '#606060',
        },
      },
      fontFamily: {
        poppins: ['var(--font-poppins)', 'sans-serif'],
        outfit:  ['var(--font-outfit)',  'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-glow': 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(168,230,61,0.12), transparent)',
      },
      boxShadow: {
        'lime-glow':   '0 0 24px rgba(168,230,61,0.35)',
        'purple-glow': '0 0 24px rgba(155,127,232,0.35)',
        'card':        '0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3)',
        'card-hover':  '0 4px 20px rgba(0,0,0,0.6)',
        'glass':       '0 1px 3px rgba(0,0,0,0.5)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
