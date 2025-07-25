/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        fadeIn: 'fadeIn 2s ease-in-out',      // Existing animation
        slideUp: 'slideUp 0.6s ease-out forwards', // Existing animation
        
        // Add indeterminate animation for loading bar
        indeterminate: 'indeterminate 1.5s infinite linear',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        
        // Add indeterminate keyframes
        indeterminate: {
          '0%': { marginLeft: '-40%' },
          '100%': { marginLeft: '100%' },
        },
      },
    },
  },
  
  plugins: [],
}
