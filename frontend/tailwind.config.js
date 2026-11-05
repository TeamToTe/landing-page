/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        tote: {
          orange: '#FF8A3D',
          orangeDark: '#E06B20',
          peach: '#FDEEE2',
          peachLight: '#FFF6ED',
          peachBorder: '#FBDCC5',
          darkBg: '#121316',
          darkCard: '#1C1E24',
          darkBorder: '#2E323D',
        }
      },
      fontFamily: {
        sans: ['"Times New Roman"', 'Times', 'serif'],
        serif: ['"Times New Roman"', 'Times', 'serif'],
      },
      boxShadow: {
        'soft': '0 8px 30px rgba(255, 138, 61, 0.08)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
}
