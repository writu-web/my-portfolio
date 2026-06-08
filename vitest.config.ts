import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()], // handles JSX transform for React components
  test: {
    environment: "jsdom",      // simulates a browser DOM (window, document, etc.)
    setupFiles: ["./vitest.setup.ts"], // runs once before all tests
    globals: true,             // makes describe/it/expect available without importing
    pool: "vmThreads",         // fixes worker timeout on Windows paths with spaces
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."), // maps @/ to project root (matches tsconfig paths)
    },
  },
});
