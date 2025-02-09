/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        montserrat: ["Montserrat", "sans-serif"],
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        customLight: {
          primary: "#eeddcc", //

          secondary: "#4c2c17", //dark brow

          accent: "#8c5c46", //light brow

          neutral: "#014e66", //darker blue

          "base-100": "#016180", //backgrounf blue

          info: "#eeddcc", //0284c7

          success: "#16a34a", //

          warning: "#f59e0b",

          error: "#ef4444",
        },
      },
      {
        cutomDark: {
          primary: "#eeddcc", //

          secondary: "#4c2c17", //dark brow

          accent: "#8c5c46", //light brow

          neutral: "#014e66", //darker blue

          "base-100": "#016180", //backgrounf blue
        },
      },
      "nord",
      "dark",
    ], // false: only light + dark | true: all themes | array: specific themes like this ["light", "dark", "cupcake"]
    darkTheme: "customLight", // name of one of the included themes for dark mode
    base: true, // applies background color and foreground color for root element by default
    styled: true, // include daisyUI colors and design decisions for all components
    utils: true, // adds responsive and modifier utility classes
    prefix: "", // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
    logs: true, // Shows info about daisyUI version and used config in the console when building your CSS
    themeRoot: ":root", // The element that receives theme color CSS variables
  },
};
