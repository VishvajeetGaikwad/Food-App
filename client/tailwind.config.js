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

html.dark {
  background-color; /* Set this to the dark background you want */
  color: #f7fafc; /* Light text for dark theme */
}

/* Optional: Light mode default */
html {
  background-color: #ffffff; /* Default light theme background */
  color: #000000;
}