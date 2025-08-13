/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  theme: {
    extend: {},
  },
  plugins: [],
}

// tailwind.config.js - extend with your electric theme
module.exports = {
  theme: {
    extend: {
      colors: {
        'pikachu': '#FFD700',
        'electric': '#00FFFF',
      }
    }
  }
}