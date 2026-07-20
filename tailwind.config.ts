import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#0B1220",
        surface: "#111827",
        card: {
          DEFAULT: "#1F2937",
          border: "#374151",
        },
        border: "#374151",
        primary: {
          DEFAULT: "#2563EB",
          hover: "#1D4ED8",
        },
        accent: "#06B6D4",
        semantic: {
          success: "#22C55E",
          warning: "#F59E0B",
          danger: "#EF4444",
          info: "#3B82F6",
          neutral: "#9CA3AF",
        },
        risk: {
          low: "#22C55E",
          medium: "#F59E0B",
          high: "#F97316",
          critical: "#EF4444",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      maxWidth: {
        command: "1440px",
      },
      borderRadius: {
        btn: "12px",
        card: "16px",
        input: "12px",
        dialog: "20px",
      },
    },
  },
  plugins: [],
};

export default config;
