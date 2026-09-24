import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        black: "#0c0a09",
        void: "#050403",
        red: { DEFAULT: "#a31621", dim: "#4a1015" },
        ivory: "#ede7de",
        stone: "#8c8479",
        line: "rgba(237,231,222,0.13)",
      },
      fontFamily: {
        vazir: ["var(--font-vazir)", "sans-serif"],
        display: ["var(--font-bebas)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
