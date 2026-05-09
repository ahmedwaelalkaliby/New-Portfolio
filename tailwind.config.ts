import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#ecfeff",
          100: "#cffafe",
          200: "#a5f3fc",
          300: "#67e8f9",
          400: "#22d3ee",
          500: "#06b6d4",
          600: "#0891b2",
          700: "#0e7490",
          800: "#155e75",
          900: "#164e63"
        },
        accent: {
          amber: "#f59e0b",
          mint: "#34d399",
          rose: "#fb7185"
        },
        night: "#070a0f"
      },
      boxShadow: {
        glow: "0 20px 60px rgba(6, 182, 212, 0.22)",
        panel: "0 24px 80px rgba(0, 0, 0, 0.32)"
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" }
        }
      },
      animation: {
        marquee: "marquee 22s linear infinite"
      }
    }
  },
  plugins: []
};
export default config;
