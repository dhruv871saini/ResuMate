import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Syne", "sans-serif"],
        serif: ["Playfair Display", "serif"],
      },
      colors: {
        ink: {
          DEFAULT: "#0D0814",
          2: "#140F1E",
          3: "#1C1528",
        },
        surface: {
          DEFAULT: "#221A30",
          2: "#2A2040",
          3: "#322850",
        },
        accent: {
          DEFAULT: "#D946EF",
          hover: "#C026D3",
          soft: "#F0ABFC",
          muted: "rgba(217,70,239,0.12)",
        },
      },
      boxShadow: {
        glow: "0 0 0 1px #D946EF",
        card: "0 4px 24px rgba(13,8,20,0.5)",
      },
    },
  },
  plugins: [],
};
export default config;
