const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        ubuntu: ["Ubuntu", ...defaultTheme.fontFamily.sans],
      },
      screens: {
        xs: "380px",
      },
      keyframes: {
        sideSway: {
          "0%": {
            transform: "translateX(-25%)",
            AnimationTimeline: " cubic-bezier(0.8, 0, 1, 1)",
          },
          "50%": {
            transform: "translateX(0)",
            AnimationTimeline: "cubic-bezier(0, 0, 0.2, 1)",
          },
          "100%": {
            transform: "translateX(-25%)",
            AnimationTimeline: " cubic-bezier(0.8, 0, 1, 1)",
          },
        },
      },
      animation:{
        sideSway:'sideSway 1s ease-in-out infinite'
      }
    },
  },
  plugins: [],
};
