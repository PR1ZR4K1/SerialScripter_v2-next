/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");
const {nextui} = require("@nextui-org/react");


module.exports = withMT({
  content: [
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {},
  plugins: [nextui({
    prefix: "app",
    themes: {
      light: {
        layout: {},
        colors: {},
            // sidebar: {
            //   sidebarBackground: '#ffffff',
            //   sidebarText: '#607489',
            //   menuContent: '#fbfcfd',
            //   menuIcon: '#0098e5',
            //   menuHoverBackground: '#c5e4ff',
            //   menuHoverText: '#44596e',
            //   menuDisabledText: '#9fb6cf',
            // }
          },
      },
      dark: {
        layout: {},
        colors: {},

            // sidebarBackground: '#0b2948',
            // sidebarText: '#8ba1b7',
            // menuContent: '#082440',
            // menuIcon: '#59d0ff',
            // menuHoverBackground: '#00458b',
            // menuHoverText: '#b6c8d9',
            // menuDisabledText: '#3e5e7e',
        }
      }
  )],
});

