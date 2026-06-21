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
          DEFAULT: "#0A0F1E",
          2: "#111827",
          3: "#1E293B",
        },
        surface: {
          DEFAULT: "#1E293B",
          2: "#253347",
          3: "#2D3E57",
        },
        accent: {
          DEFAULT: "#6366F1",
          hover: "#4F46E5",
          soft: "#818CF8",
          muted: "rgba(99,102,241,0.12)",
        },
      },
      boxShadow: {
        glow: "0 0 0 1px #6366F1",
        card: "0 4px 24px rgba(0,0,0,0.25)",
      },
    },
  },
  plugins: [],
};
export default config;
