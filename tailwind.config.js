/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary1: "#1F6FE3",
        white: "#FFFFFF",
        black1: "#272626",
        neutral1: "#504B4B",
        neutral2: '#6F7C80',
        neutral3: '#36474B',
        lemon1: "#CDFF00",
        green1: '#44934D',
        orange1: '#FCB20D',
      },
    },
  },
  plugins: [],
};
