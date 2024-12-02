import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        background: "#141414",
        sidebar: "#1d1d1d",
        primary: "#E50914",
        secondary: "#FFFFFF",
        accent: "#564d4d",
        success: "#46d369",
        card: {
          DEFAULT: "rgba(32, 32, 32, 0.8)",
          hover: "rgba(42, 42, 42, 0.9)",
        },
      },
      animation: {
        "slide-up": "slideUp 0.5s ease-out",
        "fade-in": "fadeIn 0.5s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
        "progress": "progress 1s ease-out forwards",
        "level-up": "levelUp 0.5s ease-out",
        "confetti": "confetti 5s ease-out forwards",
      },
      keyframes: {
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        progress: {
          "0%": { strokeDasharray: "0 100" },
          "100%": { strokeDasharray: "var(--progress) 100" },
        },
        levelUp: {
          "0%": { transform: "scale(0.8) rotate(-10deg)", opacity: "0" },
          "50%": { transform: "scale(1.2) rotate(5deg)", opacity: "0.8" },
          "100%": { transform: "scale(1) rotate(0)", opacity: "1" },
        },
        confetti: {
          "0%": { transform: "translateY(0) rotate(0)", opacity: "1" },
          "100%": { transform: "translateY(100vh) rotate(720deg)", opacity: "0" },
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;