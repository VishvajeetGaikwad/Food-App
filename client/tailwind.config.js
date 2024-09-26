/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // Enables dark mode based on a class
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        orange: "var(--button)",
        hoverOrange: "var(--hoverButtonColor)",
      },
    },
  },
  plugins: [],
};
