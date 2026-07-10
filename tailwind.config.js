/* eslint-disable @typescript-eslint/no-require-imports */
const colors = require('./src/config/colors.json');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class', // Advanced: Enable dark mode by class
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        brand: colors,
      },
      fontFamily: {
        sans: ['var(--font-outfit)', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '112': '28rem',
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'glass': '0 8px 30px rgb(0,0,0,0.04)',
        'glass-hover': '0 8px 30px rgb(0,0,0,0.06)',
        'glass-dark': '0 8px 30px rgb(0,0,0,0.12)',
        'glow': '0 2px 10px -3px rgba(6,81,237,0.1), 0 10px 20px -2px rgba(6,81,237,0.06)',
        'modal': '0 20px 50px -12px rgb(0,0,0,0.15)',
        'primary': '0 4px 14px 0 rgba(99,102,241,0.39)',
        'primary-hover': '0 6px 20px rgba(99,102,241,0.23)',
        'danger': '0 4px 14px 0 rgba(239,68,68,0.39)',
        'danger-hover': '0 6px 20px rgba(239,68,68,0.23)',
        'inset-subtle': 'inset 0 1px 2px rgba(0,0,0,0.02)',
        'inset-white': 'inset 0 1px 1px rgba(255,255,255,1)',
        'inset-white-soft': 'inset 0 1px 1px rgba(255,255,255,0.05)',
        'float': '0 5px 15px rgba(0,0,0,0.08), 0 15px 35px rgba(0,0,0,0.05)',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
        'modal': '999',
        'tooltip': '1000',
      },
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'spring': 'cubic-bezier(0.43, 0.13, 0.23, 0.96)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.1) 100%)',
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "slide-down": {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "pulse-slow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        }
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out",
        "slide-up": "slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-down": "slide-down 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "pulse-slow": "pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "scale-in": "scale-in 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};
