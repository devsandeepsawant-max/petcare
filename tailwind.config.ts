import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: "#f0f7f3",
          100: "#dcf0e3",
          200: "#bae1cb",
          300: "#8dcca9",
          400: "#5cb183",
          500: "#3c9664",
          600: "#2d784f",
          700: "#246040",
          800: "#1f4c34",
          900: "#1b402d",
          950: "#0d2419",
        },
        coral: {
          50: "#fff5f2",
          100: "#ffe7e1",
          200: "#ffd2c7",
          300: "#ffb3a1",
          400: "#fd8569",
          500: "#f45e3c",
          600: "#e04320",
          700: "#bc3417",
          800: "#9b2e18",
          900: "#7f2b1a",
          950: "#451209",
        },
        cream: {
          50: "#fdfcfa",
          100: "#faf8f5",
          200: "#f5f0e8",
          300: "#ebe2d5",
          400: "#ddd0bc",
          500: "#ccbba0",
        },
        charcoal: {
          50: "#f6f6f7",
          100: "#e7e7e9",
          200: "#d1d2d5",
          300: "#b0b2b8",
          400: "#888b94",
          500: "#6d707a",
          600: "#575962",
          700: "#47484f",
          800: "#3d3e43",
          900: "#1f2937",
          950: "#111827",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 2px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02)",
        hover: "0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.02)",
      },
    },
  },
  plugins: [],
} satisfies Config;
