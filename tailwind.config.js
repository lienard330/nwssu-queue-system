/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB',
        'dark-blue': '#1D4ED8',
        'admin-body': '#F1F5F9',
        'text-primary': '#1E293B',
        'text-muted': '#64748B',
        'info-bg': '#EFF6FF',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
