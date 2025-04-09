/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          light: '#4FD1C5',   // Azul claro
          DEFAULT: '#319795', // Azul médio
          dark: '#285E61',    // Azul escuro
          aqua: '#81E6D9',    // Verde água
          black: '#1A202C',   // Preto
          gray: '#CBD5E0',    // Cinza claro
          white: '#FFFFFF',   // Branco
        }
      }
    }
  },
  plugins: [],
}
