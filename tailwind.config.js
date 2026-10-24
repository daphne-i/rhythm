/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        espresso: {
          950: 'rgb(var(--c-espresso-950) / <alpha-value>)',
          900: 'rgb(var(--c-espresso-900) / <alpha-value>)',
          800: 'rgb(var(--c-espresso-800) / <alpha-value>)',
          700: 'rgb(var(--c-espresso-700) / <alpha-value>)',
        },
        cream: {
          50: 'rgb(var(--c-cream-50) / <alpha-value>)',
          100: 'rgb(var(--c-cream-100) / <alpha-value>)',
          200: 'rgb(var(--c-cream-200) / <alpha-value>)',
        },
        terracotta: {
          600: 'rgb(var(--c-terracotta-600) / <alpha-value>)',
          500: 'rgb(var(--c-terracotta-500) / <alpha-value>)',
          100: 'rgb(var(--c-terracotta-100) / <alpha-value>)',
        },
        olive: {
          600: 'rgb(var(--c-olive-600) / <alpha-value>)',
          500: 'rgb(var(--c-olive-500) / <alpha-value>)',
          100: 'rgb(var(--c-olive-100) / <alpha-value>)',
        },
        plum: {
          600: 'rgb(var(--c-plum-600) / <alpha-value>)',
          500: 'rgb(var(--c-plum-500) / <alpha-value>)',
          100: 'rgb(var(--c-plum-100) / <alpha-value>)',
        },
        teal: {
          600: 'rgb(var(--c-teal-600) / <alpha-value>)',
          500: 'rgb(var(--c-teal-500) / <alpha-value>)',
          100: 'rgb(var(--c-teal-100) / <alpha-value>)',
        },
        amber: {
          500: 'rgb(var(--c-amber-500) / <alpha-value>)',
          100: 'rgb(var(--c-amber-100) / <alpha-value>)',
        }
      },
      boxShadow: {
        'bento': '0 8px 24px -6px rgba(0, 0, 0, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'sheet': '0 -12px 36px rgba(0, 0, 0, 0.25)',
      }
    },
  },
  plugins: [],
}