export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1f2a21', // טקסט כהה על רקע בהיר
        paper: '#f3f1ea',
        surface: '#ffffff',
        leaf: '#3f7d4e', // צבע ראשי: ירוק עלה מעומעם
        cal: '#e2674f',
        protein: '#4f86c6',
        carbs: '#e0a526',
        fat: '#9a6aa6',
        water: '#3fa3bd',
      },
      fontFamily: {
        sans: ['Heebo', 'system-ui', 'Segoe UI', 'Arial', 'sans-serif'],
        display: ['Heebo', 'system-ui', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
