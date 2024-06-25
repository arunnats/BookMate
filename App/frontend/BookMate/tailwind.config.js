/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			fontFamily: {},
		},
	},
	plugins: [require("daisyui")],
	daisyui: {
		themes: [
			{
				customLight: {
					primary: "#eeddcc", //

					secondary: "#4A8CB0", //16a34a

					accent: "#016180", //

					neutral: "#014e66", //8C5C47

					"base-100": "#016180", //4C2C17

					info: "#eeddcc", //0284c7

					success: "#16a34a", //

					warning: "#f59e0b",

					error: "#ef4444",
				},
			},
			{
				cutomDark: {
					primary: "#a991f7",
					secondary: "#f6d860",
					accent: "#37cdbe",
					neutral: "#3d4451",
					"base-100": "#ffffff",
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
