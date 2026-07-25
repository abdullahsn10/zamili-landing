import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#F1EEFC",
          100: "#E3DDF9",
          200: "#C6BBF2",
          300: "#A395E8",
          400: "#7C69DC",
          500: "#5C46D2",
          600: "#4C3BCF",
          700: "#3D2FA6",
          800: "#2F2480",
          900: "#211960",
          950: "#14103D",
        },
        ember: {
          400: "#FFB37E",
          500: "#FF8A4C",
          600: "#E96F2E",
        },
        teal: {
          500: "#1FB5A6",
        },
        ink: {
          DEFAULT: "#15161B",
          2: "#4A4B57",
          // 4.97:1 on white — WCAG AA for normal-size text (#82838F only hit ~3.76:1).
          3: "#6E6F7A",
        },
        paper: {
          DEFAULT: "#FCFBFA",
          2: "#F3F1EE",
        },
        line: "#E7E4E0",
        midnight: "#0D0B1F",
      },
      fontFamily: {
        arabic: ["var(--font-arabic)", "Segoe UI", "Tahoma", "sans-serif"],
        latin: ["var(--font-latin)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      transitionTimingFunction: {
        settle: "cubic-bezier(0.22, 1, 0.36, 1)",
        snap: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      boxShadow: {
        soft: "0 1px 2px rgb(21 22 27 / 0.04), 0 8px 24px rgb(21 22 27 / 0.06)",
        glow: "0 0 0 1px rgb(76 59 207 / 0.16), 0 16px 40px rgb(76 59 207 / 0.22)",
        card: "0 1px 0 rgb(21 22 27 / 0.03), 0 2px 8px rgb(21 22 27 / 0.05)",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(14px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-dot": {
          "0%, 100%": { opacity: "0.35", transform: "scale(0.9)" },
          "50%": { opacity: "1", transform: "scale(1.1)" },
        },
        "drift-a": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "50%": { transform: "translate(3%, -4%) scale(1.06)" },
        },
        "drift-b": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "50%": { transform: "translate(-4%, 3%) scale(1.08)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0) rotate(var(--tilt, 0deg))" },
          "50%": { transform: "translateY(-8px) rotate(var(--tilt, 0deg))" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) both",
        "pulse-dot": "pulse-dot 1.8s ease-in-out infinite",
        "drift-a": "drift-a 18s ease-in-out infinite",
        "drift-b": "drift-b 22s ease-in-out infinite",
        float: "float 5s ease-in-out infinite",
        "float-slow": "float-slow 7s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
