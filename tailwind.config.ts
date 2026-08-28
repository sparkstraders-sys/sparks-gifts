import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: "#fdfaf0",
          100: "#faf0d0",
          200: "#f5e099",
          300: "#e8c84a",
          400: "#d4a01f",
          500: "#b8860b",
          600: "#9a6f08",
          700: "#7a5706",
          800: "#5c4004",
          900: "#3d2a02",
        },
        navy: {
          50: "#f0f3f8",
          100: "#d9e2ef",
          200: "#b3c5de",
          300: "#7d9cc2",
          400: "#4d77a8",
          500: "#2d5a8e",
          600: "#1e4070",
          700: "#152d52",
          800: "#0e1f38",
          900: "#071020",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-playfair)", "Georgia", "serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.4s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
