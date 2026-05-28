import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx,js,jsx}",
    "./components/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        ocean: {
          50: "#f0fbff",
          100: "#dff5ff",
          200: "#b9ebff",
          300: "#7ddafe",
          400: "#36c4f7",
          500: "#0bace2",
          600: "#008ac0",
          700: "#066e9b",
          800: "#0c5b80",
          900: "#104a6b",
          950: "#062c47",
        },
        sand: {
          50: "#fef9ed",
          100: "#fcf0d0",
          200: "#fadc94",
          300: "#f7bf55",
          400: "#f5a430",
          500: "#ee8516",
          600: "#d36410",
          700: "#af4711",
          800: "#8e3814",
          900: "#742f14",
        },
        sunset: {
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
        },
        depth: {
          900: "#0a1929",
          950: "#061320",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "ocean-gradient": "linear-gradient(135deg, #062c47 0%, #066e9b 50%, #0bace2 100%)",
        "sunset-gradient": "linear-gradient(135deg, #ea580c 0%, #f5a430 50%, #fadc94 100%)",
      },
      animation: {
        "wave-slow": "wave 10s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        wave: {
          "0%, 100%": { transform: "translateX(0)" },
          "50%": { transform: "translateX(-25px)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
