/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        coffee: {
          950: '#0d0b09', 
          900: '#181411', 
          850: '#231d19', 
          800: '#2e2621', 
          700: '#4c3f37', 
        },
        biscuit: '#c6a67a', 
        cream: '#fdfbf7',   
        beige: '#e5d3b3',   
        brown: {
          DEFAULT: '#8b5a2b',
          dark: '#5c3a21',
          light: '#a0785a'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'Lora', 'Georgia', 'serif'],
      },
      boxShadow: {
        'premium': '0 4px 30px rgba(13, 11, 9, 0.4)',
        'premium-hover': '0 10px 40px rgba(198, 166, 122, 0.15)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
      }
    },
  },
  plugins: [],
}
