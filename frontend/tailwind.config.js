export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#030712',
          900: '#0f172a',
          800: '#1e293b',
          700: '#334155'
        },
        cyber: {
          cyan: '#06b6d4',
          violet: '#8b5cf6',
          emerald: '#10b981',
          rose: '#f43f5e'
        }
      }
    }
  },
  plugins: []
};
