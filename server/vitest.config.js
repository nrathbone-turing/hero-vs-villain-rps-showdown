/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node', // use Node for server tests
    setupFiles: './vitest.setup.js',
  },
})