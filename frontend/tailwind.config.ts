import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: "hsl(var(--surface) / <alpha-value>)",
          elevated: "hsl(var(--surface-elevated) / <alpha-value>)",
        },
        border: "hsl(var(--border) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        muted: "hsl(var(--muted) / <alpha-value>)",
        accent: {
          DEFAULT: "hsl(var(--accent) / <alpha-value>)",
          foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        "ios": "1.25rem",
        "ios-lg": "1.5rem",
      },
      boxShadow: {
        glow: "0 0 0 1px hsl(var(--accent) / 0.15), 0 24px 64px -24px hsl(var(--accent) / 0.35)",
        "ios-card":
          "0 0 0 0.5px hsl(var(--border) / 0.6), 0 2px 8px -2px hsl(0 0% 0% / 0.08), 0 16px 40px -12px hsl(0 0% 0% / 0.12)",
        "ios-card-dark":
          "0 0 0 0.5px hsl(var(--border) / 0.5), 0 2px 12px -2px hsl(0 0% 0% / 0.35), 0 24px 48px -16px hsl(0 0% 0% / 0.45)",
        "ios-float": "0 8px 32px -8px hsl(0 0% 0% / 0.2), 0 0 0 1px hsl(var(--border) / 0.4)",
      },
      transitionTimingFunction: {
        ios: "cubic-bezier(0.25, 0.1, 0.25, 1)",
        "ios-out": "cubic-bezier(0.16, 1, 0.3, 1)",
        "ios-spring": "cubic-bezier(0.34, 1.2, 0.64, 1)",
      },
      transitionDuration: {
        ios: "380ms",
        "ios-short": "240ms",
      },
      keyframes: {
        "ios-enter": {
          from: { opacity: "0", transform: "translateY(12px) scale(0.988)" },
          to: { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "ios-fade-up": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "ios-enter": "ios-enter 0.52s cubic-bezier(0.16, 1, 0.3, 1) both",
        "ios-fade-in": "ios-fade-up 0.55s cubic-bezier(0.16, 1, 0.3, 1) both",
      },
    },
  },
  plugins: [],
};

export default config;
