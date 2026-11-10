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
          DEFAULT: "#211713",
          light: "#2a1e19",
          dark: "#17100d",
        },
        cafe: {
          deep: "#38251E",
          roast: "#654332",
          caramel: "#B87945",
          "caramel-hover": "#c88651",
          latte: "#D6B58C",
          cream: "#F2E6D5",
          muted: "#A8978A",
        },
        status: {
          online: "#75D69A",
          offline: "#E47770",
          pending: "#E5A93C",
          delivered: "#7EAEF5",
        },
      },
      fontFamily: {
        sans: [
          "Outfit",
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        mono: [
          "JetBrains Mono",
          "Fira Code",
          "monospace",
        ],
      },
      boxShadow: {
        "coffee-sm": "0 2px 8px -2px rgba(33, 23, 19, 0.6), 0 1px 4px -1px rgba(184, 121, 69, 0.1)",
        "coffee-md": "0 8px 24px -6px rgba(33, 23, 19, 0.7), 0 4px 12px -2px rgba(184, 121, 69, 0.15)",
        "coffee-lg": "0 16px 36px -10px rgba(15, 10, 8, 0.8), 0 6px 18px -2px rgba(184, 121, 69, 0.2)",
        "caramel-glow": "0 0 20px -3px rgba(184, 121, 69, 0.45)",
        "caramel-glow-lg": "0 0 35px -2px rgba(184, 121, 69, 0.65)",
        "online-glow": "0 0 16px 1px rgba(117, 214, 154, 0.5)",
        "offline-glow": "0 0 16px 1px rgba(228, 119, 112, 0.4)",
        "inner-glow": "inset 0 1px 1px 0 rgba(214, 181, 140, 0.15)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in": "fadeIn 0.25s ease-out forwards",
        "slide-up": "slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
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
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};

