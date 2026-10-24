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
          950: '#16110E',
          900: '#231A16',
          800: '#352822',
          700: '#4E3B32',
        },
        cream: {
          50: '#FDFBF7',
          100: '#F8F3EA',
          200: '#EFE5D4',
        },
        terracotta: {
          600: '#B04822',
          500: '#C85A32',
          100: '#FCECE6',
        },
        olive: {
          600: '#4A5D3F',
          500: '#5C734E',
          100: '#EBF0E8',
        },
        plum: {
          600: '#6B3654',
          500: '#844669',
          100: '#F5EBF0',
        },
        teal: {
          600: '#1F5C5C',
          500: '#2A7575',
          100: '#E5F2F2',
        },
        amber: {
          500: '#D98A2B',
          100: '#FDF3E3',
        }
      },
      boxShadow: {
        'bento': '0 8px 24px -6px rgba(35, 26, 22, 0.08), 0 2px 6px -1px rgba(35, 26, 22, 0.04)',
        'sheet': '0 -12px 36px rgba(22, 17, 14, 0.22)',
      }
    },
  },
  plugins: [],
}