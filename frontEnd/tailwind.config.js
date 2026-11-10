/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        espresso: {
          DEFAULT: "#060A08", // Terminal void black
          light: "#0A110D",   // Obsidian cyber slate
          dark: "#030504",    // Pitch black
        },
        cafe: {
          deep: "#0D1912",          // Cyber terminal panels & cards
          roast: "#153322",         // Circuit wireframe & cyber borders
          caramel: "#00FF66",       // Toxic Neon Green / Matrix Accent
          "caramel-hover": "#26FF79",
          latte: "#00F0FF",         // Cyber Ice Cyan
          cream: "#E8FFF0",         // Phosphor bright mint white
          muted: "#558269",         // Dim phosphor matrix green
        },
        status: {
          online: "#00FF66",        // Toxic Electric Neon Green
          offline: "#FF3366",       // Cyberpunk Neon Crimson
          pending: "#FFB800",       // Cyber Amber Hazard
          delivered: "#00F0FF",     // Electric Ice Cyan
        },
      },
      fontFamily: {
        sans: [
          "JetBrains Mono",
          "Outfit",
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "monospace",
          "sans-serif",
        ],
        mono: [
          "JetBrains Mono",
          "Fira Code",
          "Courier New",
          "monospace",
        ],
      },
      boxShadow: {
        "coffee-sm": "0 2px 8px -2px rgba(0, 0, 0, 0.9), 0 1px 4px -1px rgba(0, 255, 102, 0.15)",
        "coffee-md": "0 8px 24px -6px rgba(0, 0, 0, 0.95), 0 4px 12px -2px rgba(0, 255, 102, 0.2)",
        "coffee-lg": "0 16px 36px -10px rgba(0, 0, 0, 0.98), 0 6px 18px -2px rgba(0, 255, 102, 0.25)",
        "caramel-glow": "0 0 20px -2px rgba(0, 255, 102, 0.5)",
        "caramel-glow-lg": "0 0 35px 0px rgba(0, 255, 102, 0.75)",
        "cyan-glow": "0 0 20px -2px rgba(0, 240, 255, 0.5)",
        "online-glow": "0 0 16px 2px rgba(0, 255, 102, 0.6)",
        "offline-glow": "0 0 16px 2px rgba(255, 51, 102, 0.5)",
        "inner-glow": "inset 0 1px 1px 0 rgba(0, 255, 102, 0.2)",
      },
      animation: {
        "pulse-slow": "pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in": "fadeIn 0.2s ease-out forwards",
        "slide-up": "slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "scale-in": "scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.97)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};
