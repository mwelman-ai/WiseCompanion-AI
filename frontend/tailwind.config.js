/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: { primary: '#2563eb', secondary: '#059669', accent: '#f59e0b', bg: '#f8fafc', text: '#1e293b' }, fontSize: {
        'base': '1.125rem', // 18px
        'lg': '1.25rem',    // 20px
        'xl': '1.375rem',   // 22px
      },
    },
  },
  plugins: [],
}
