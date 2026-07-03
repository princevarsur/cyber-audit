import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cybersecurity / GRC dark theme
        base: "#0b1220",
        surface: "#121c2e",
        surface2: "#182236",
        edge: "#243049",
        brand: {
          DEFAULT: "#22d3ee", // cyan accent
          soft: "#0e7490",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
