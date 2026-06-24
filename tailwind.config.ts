import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand — kept same hues, adapted for light theme
        lime: {
          DEFAULT: '#5C9E00',  // darker for readable text on white
          bright:  '#6BBF00',
          light:   '#EEF9D9',  // light tint for backgrounds
          tag:     '#E8F5D0',
        },
        purple: {
          brand: '#6A4CC3',
          light: '#8B6FD9',
          dark:  '#4E38A0',
          tint:  '#F0ECFB',    // light tint for backgrounds
        },
        // Light theme surfaces
        surface: {
          DEFAULT: '#FFFFFF',
          secondary: '#F8F9FA',
          tertiary:  '#F1F3F5',
          border:    '#E5E7EB',
          hover:     '#F3F4F6',
        },
        // Text
        ink: {
          DEFAULT: '#111827',  // near-black
          muted:   '#6B7280',
          faint:   '#9CA3AF',
        },
      },
      fontFamily: {
        poppins: ['var(--font-poppins)', 'sans-serif'],
        outfit:  ['var(--font-outfit)',  'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-glow': 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(92,158,0,0.08), transparent)',
      },
      boxShadow: {
        'lime-glow':   '0 0 20px rgba(92, 158, 0, 0.2)',
        'purple-glow': '0 0 20px rgba(106, 76, 195, 0.2)',
        'card':        '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'card-hover':  '0 4px 16px rgba(0,0,0,0.10)',
        'glass':       '0 1px 3px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
