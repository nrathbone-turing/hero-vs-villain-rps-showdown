/// <reference types="vitest" />
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    setupFiles: "./vitest.setup.js",
    environmentMatchGlobs: [
      ["client/**", "jsdom"],  // all client tests run in jsdom
      ["server/**", "node"],   // all server tests run in node
    ],
  },
});