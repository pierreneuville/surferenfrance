import { defineConfig } from "vitest/config";
import path from "node:path";

/**
 * Vitest config — Node environment is enough for our smoke tests (pure
 * function libs: score, tide, buoys parser). No JSDOM, no React testing
 * yet — keep the bar low so tests stay fast and PRs run them happily.
 */
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
  test: {
    environment: "node",
    include: ["**/*.test.ts"],
    exclude: ["node_modules", ".next", ".vercel"],
    globals: false,
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["lib/**/*.ts"],
      exclude: ["lib/translations/**", "lib/**/*.d.ts"],
    },
  },
});
