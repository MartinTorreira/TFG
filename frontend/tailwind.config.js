/** @type {import('tailwindcss').Config} */
const { nextui } = require("@nextui-org/theme");
const withMT = require("@material-tailwind/react/utils/withMT");
const { fontFamily } = require("tailwindcss/defaultTheme");

module.exports = withMT({
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@nextui-org/theme/dist/components/(dropdown|menu|divider|popover|button|ripple|spinner).js",
  ],
  theme: {
    extend: {
      fontFamily: {
        roboto: ["Inter", "Onest", "Roboto", "sans-serif"],
      },
      colors: {
        accent: "#60dcd0",
        "accent-ligth": "#bde7e0",
        "accent-dark": "#46beb1",
      },
      backgroundBlendMode: {
        "color-dodge": "color-dodge",
      },
    },
  },
  plugins: [nextui({})],
});
