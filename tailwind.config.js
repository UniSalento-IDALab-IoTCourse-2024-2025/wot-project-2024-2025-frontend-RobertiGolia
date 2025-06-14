/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to inculde the paths to all of all component files.
  //file preso da nativewind
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}" ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#F4F4F6",
        secondary: "#2E2E38",
        light: {
          100: "#FFFFFF",
          200: "#E6E6EB",
          300: "#C7C7D1",
        },
        dark: {
          100: "#3B3B45",
          200: "#1C1C24",
        },
        accent: "#00CFFF",
      },
    },
    
  },
  plugins: [],
}
