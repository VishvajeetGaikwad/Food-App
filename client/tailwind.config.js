/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // Enables dark mode based on a class
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        orange: "var(--button)",
        hoverOrange: "var(--hoverButtonColor)",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: "hsl(var(--card))",
        "card-foreground": "hsl(var(--card-foreground))",
        popover: "hsl(var(--popover))",
        "popover-foreground": "hsl(var(--popover-foreground))",
        border: "hsl(var(--border))",
        ring: "hsl(var(--ring))",
      },
    },
  },
  plugins: [],
};
