/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#1464D2',
          deep: '#0B3B73',
          teal: '#0D9488',
          green: '#16A34A',
          softBlue: '#EFF6FF',
          softTeal: '#F0FDFA',
          bg: '#F6F9FC',
          text: '#172033',
          muted: '#64748B',
          border: '#E2E8F0',
          warning: '#F59E0B',
          danger: '#DC2626',
        },
      },
      boxShadow: {
        '2xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'xs': '0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px -1px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
}
