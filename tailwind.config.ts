import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx,js,jsx}",
    "./components/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Deep ocean → from abyss to foam
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
        // Lagoon turquoise — Mediterranean, Polynesian
        lagoon: {
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#14b8a6",
          600: "#0d9488",
        },
        // Sunset coral — golden hour, neon sunset
        coral: {
          300: "#fda4af",
          400: "#fb7185",
          500: "#f43f5e",
          600: "#e11d48",
        },
        // Warm sun / golden hour
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
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
        },
        // Deep night ocean
        depth: {
          900: "#0a1929",
          950: "#061320",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        script: ["var(--font-script)", "cursive"],
      },
      backgroundImage: {
        "ocean-gradient": "linear-gradient(135deg, #062c47 0%, #066e9b 50%, #0bace2 100%)",
        "sunset-gradient": "linear-gradient(135deg, #e11d48 0%, #f97316 45%, #fbbf24 100%)",
        "golden-hour": "linear-gradient(180deg, #1a0936 0%, #4c1d95 25%, #e11d48 60%, #f97316 85%, #fbbf24 100%)",
        "lagoon-gradient": "linear-gradient(135deg, #0d9488 0%, #14b8a6 50%, #5eead4 100%)",
        "abyss-gradient": "linear-gradient(180deg, #061320 0%, #062c47 60%, #066e9b 100%)",
      },
      boxShadow: {
        "glow-ocean": "0 0 60px rgba(11, 172, 226, 0.35)",
        "glow-sunset": "0 0 60px rgba(244, 63, 94, 0.35)",
        "glow-golden": "0 0 60px rgba(251, 191, 36, 0.3)",
      },
      animation: {
        "wave-slow": "wave 12s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "shimmer": "shimmer 2.5s linear infinite",
        "tide": "tide 8s ease-in-out infinite",
        "sunset-pulse": "sunsetPulse 4s ease-in-out infinite",
      },
      keyframes: {
        wave: {
          "0%, 100%": { transform: "translateX(0) translateY(0)" },
          "33%": { transform: "translateX(-15px) translateY(-5px)" },
          "66%": { transform: "translateX(8px) translateY(3px)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        tide: {
          "0%, 100%": { transform: "translateY(0) scaleX(1)" },
          "50%": { transform: "translateY(-4px) scaleX(1.02)" },
        },
        sunsetPulse: {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
