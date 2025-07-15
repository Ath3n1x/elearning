module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3B82F6', // blue-500
          hover: '#2563EB',   // blue-600
        },
        secondary: '#10B981', // green-500
        background: '#F9FAFB', // gray-50
        textdark: '#1F2937',   // gray-800
        textlight: '#374151',  // gray-700
        card: '#FFFFFF',       // white
        danger: '#EF4444',     // red-500
        warning: '#F59E0B',    // amber-500
        success: '#22C55E',    // green-400
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}; 