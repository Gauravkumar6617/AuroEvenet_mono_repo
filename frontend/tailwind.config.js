/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef4ff",
          100: "#d9e6ff",
          200: "#bfd4ff",
          300: "#95b7ff",
          400: "#678fff",
          500: "#4568f9",
          600: "#374eea",
          700: "#2f3fd0",
          800: "#2b37a8",
          900: "#293584",
        },
        accent: {
          100: "#f5f2ff",
          300: "#d6c5ff",
          500: "#9f7aea",
          700: "#6f42c1",
        },
        slate: {
          25: "#fcfdff",
        },
      },
      boxShadow: {
        soft: "0 8px 40px rgba(32, 48, 96, 0.08)",
        glass: "0 10px 32px rgba(65, 88, 180, 0.12)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Space Grotesk", "Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      backgroundImage: {
        "hero-gradient":
          "radial-gradient(circle at 10% 15%, rgba(69, 104, 249, 0.18), transparent 30%), radial-gradient(circle at 85% 20%, rgba(159, 122, 234, 0.2), transparent 35%), linear-gradient(180deg, #fdfdff 0%, #f6f8ff 100%)",
      },
      animation: {
        float: "float 7s ease-in-out infinite",
        "fade-up": "fadeUp 0.5s ease-out forwards",
        gradient: "gradient 8s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        gradient: {
          "0%": { "background-position": "0% 50%" },
          "50%": { "background-position": "100% 50%" },
          "100%": { "background-position": "0% 50%" },
        },
      },
    },
  },
  plugins: [],
};
