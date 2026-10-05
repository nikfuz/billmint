/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: '#0B231C', 700: '#163A2F', 500: '#3D5A50', 300: '#8AA096' },
        paper: { DEFAULT: '#F6F2E9', 50: '#FBF9F4', 200: '#ECE5D6', 300: '#DED5C1' },
        mint: { DEFAULT: '#3BE0A6', 600: '#14B47E', 700: '#0E8A61', 100: '#D6F8EA' },
        tang: { DEFAULT: '#FF6B3D', 100: '#FFE3D8' },
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 0 rgba(11,35,28,0.04), 0 8px 30px -12px rgba(11,35,28,0.18)',
        paper: '0 30px 60px -20px rgba(11,35,28,0.35), 0 2px 6px rgba(11,35,28,0.08)',
        hard: '4px 4px 0 0 #0B231C',
      },
    },
  },
  plugins: [],
};
