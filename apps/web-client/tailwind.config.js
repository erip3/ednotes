/** @type {import('tailwindcss').Config} */

import defaultTheme from 'tailwindcss/defaultTheme';
import tailwindcssAnimate from 'tailwindcss-animate';
import typography from '@tailwindcss/typography';

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        marginal: {
          background: 'hsl(var(--marginal-background))',
          foreground: 'hsl(var(--marginal-foreground))',
          border: 'hsl(var(--marginal-border))',
        },
        primary: {
          background: 'hsl(var(--primary-background))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        warning: {
          background: 'hsl(var(--warning-background))',
          foreground: 'hsl(var(--warning-foreground))',
        },
        muted: {
          background: 'hsl(var(--muted-background))',
          foreground: 'hsl(var(--muted-foreground))',
          border: 'hsl(var(--muted-border))',
        },
        accent: {
          background: 'hsl(var(--accent-background))',
          foreground: 'hsl(var(--accent-foreground))',
        },
      },
      boxShadow: {
        card: '0 10px 15px -3px hsl(var(--card-shadow))',
        'card-hover': '0 10px 15px -3px hsl(var(--card-shadow-active))',
        'card-active': '0 5px 10px -3px hsl(var(--card-shadow-active))',
      },
      borderColor: {
        border: 'hsl(var(--border))',
        'muted-border': 'hsl(var(--muted-border))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [tailwindcssAnimate, typography],
};
