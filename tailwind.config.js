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
        'domain-1': '#3B82F6', // blue
        'domain-2': '#8B5CF6', // purple
        'domain-3': '#10B981', // green
        'domain-4': '#F59E0B', // orange/amber
        'domain-5': '#EF4444', // red
      }
    },
  },
  plugins: [],
}
