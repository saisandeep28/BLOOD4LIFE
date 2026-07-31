import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        brand: {
          DEFAULT: '#B3141E',
          dark: '#8C0F17',
          light: '#D32F2F',
          foreground: '#FFFFFF',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        success: {
          DEFAULT: '#1E8E5A',
        },
        warning: {
          DEFAULT: '#E8A33D',
        },
        danger: {
          DEFAULT: '#D32F2F',
        },
        neutral: {
          900: '#1A1A2E',
          500: '#666666',
          100: '#F2F2F2',
        },
      },
      borderRadius: {
        card: '16px',
        button: '12px',
        input: '12px',
        modal: '24px',
      },
      boxShadow: {
        'tier-1': '0px 2px 8px rgba(0,0,0,0.06)',
        'tier-2': '0px 8px 24px rgba(0,0,0,0.10)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.1)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'brand-gradient': 'linear-gradient(to right, #B3141E, #D32F2F)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
export default config;
