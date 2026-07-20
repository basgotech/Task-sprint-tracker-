/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1B2430",
        slate: {
          950: "#0F1520",
        },
        signal: {
          DEFAULT: "#5B8DEF",
          soft: "#E7EEFD",
        },
        amber: {
          DEFAULT: "#E2A857",
        },
        moss: {
          DEFAULT: "#5E9C76",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(15, 21, 32, 0.06), 0 1px 1px rgba(15, 21, 32, 0.04)",
      },
    },
  },
  plugins: [],
};
