import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    env: {
      NODE_ENV: "test",
    },
    setupFiles: "./test/setup.js",
     exclude: [
    "node_modules",
    "dist",
    "build"
  ],
  },
});