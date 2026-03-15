/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Playfair Display", "serif"],
        body: ["Source Sans 3", "sans-serif"]
      },
      colors: {
        ink: "#1C1C1C",
        sand: "#F5EFE6",
        clay: "#D2B48C",
        brass: "#A3772B",
        moss: "#3D5A40"
      },
      boxShadow: {
        card: "0 18px 45px rgba(16, 24, 40, 0.12)",
        soft: "0 8px 20px rgba(16, 24, 40, 0.08)"
      }
    }
  },
  plugins: [require("@tailwindcss/forms")]
};
