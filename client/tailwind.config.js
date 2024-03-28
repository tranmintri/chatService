/** @type {import("tailwindcss").Config} */
module.exports = {
  prefix: "tw-",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundColor: {
        "dark-1": "#313338",
        "dark-2": "#1E1F22",
        "blue-1": "#5865F2",
      },
      colors: {
        "dark-1": "#FFFFFF",
        "dark-2": "#B5BAC1",
        "blue-1": "#02A3F3",
      },
    },
  },
  plugins: [],
};
