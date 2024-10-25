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
      animation: {
        typewriter: "typewriter 2s steps(11) forwards",
      },
      keyframes: {
        typewriter: {
          to: {
            left: "100%"
          }
        }
      },
      fontFamily: {
        sans: [
          "IBM Plex Sans",
          "Poppins",
          "Montserrat",
          "Open Sans",
          "Switzer",
          "Lato",
          "Inter",
          "Onest",
          "Roboto",
          "sans-serif",
        ],
        lato: ["Lato"],
      },
      colors: {
        accent: "#60dcd0",
        "accent-light": "#bde7e0",
        "accent-dark": "#46beb1",
        "accent-darker": "#3caa9f",
      },
      backgroundBlendMode: {
        "color-dodge": "color-dodge",
      },
    },
  },
  plugins: [nextui({})],
});
