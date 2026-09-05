import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--color-background)",
        foreground: "var(--color-foreground)",
        muted: "var(--color-muted)",
        border: "var(--color-border)",
        surface: "var(--color-surface)",
        "surface-hover": "var(--color-surface-hover)",
        secondary: "var(--color-secondary)",
        overlay: "var(--color-overlay)",
        navy: "var(--color-navy)",
        accent: {
          DEFAULT: "var(--color-accent)",
          hover: "var(--color-accent-hover)",
          light: "var(--color-accent-light)",
        },
        success: {
          bg: "var(--color-success-bg)",
          text: "var(--color-success-text)",
          border: "var(--color-success-border)",
        },
        warning: {
          bg: "var(--color-warning-bg)",
          text: "var(--color-warning-text)",
          border: "var(--color-warning-border)",
        },
        danger: {
          bg: "var(--color-danger-bg)",
          text: "var(--color-danger-text)",
          border: "var(--color-danger-border)",
        },
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "system-ui", "sans-serif"],
        display: ["var(--font-jakarta)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.02)",
        premium: "0 12px 36px -4px rgba(0, 0, 0, 0.08), 0 4px 12px -2px rgba(0, 0, 0, 0.03)",
        glow: "0 0 35px rgba(249, 115, 22, 0.25)",
        "glow-lg": "0 0 60px rgba(249, 115, 22, 0.35)",
        "glow-amber": "0 0 40px rgba(245, 158, 11, 0.25)",
        card: "0 1px 3px rgba(0, 0, 0, 0.03), 0 6px 20px rgba(0, 0, 0, 0.04)",
        "card-hover": "0 16px 36px rgba(249, 115, 22, 0.1), 0 4px 12px rgba(0, 0, 0, 0.04)",
      },
      transitionTimingFunction: {
        premium: "cubic-bezier(0.22, 1, 0.36, 1)",
        spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      animation: {
        float: "float 5s ease-in-out infinite",
        mesh: "mesh-drift 18s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
