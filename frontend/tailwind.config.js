/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        shine: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        shine: "shine 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
