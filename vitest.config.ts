// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
    },
    environmentMatchGlobs: [
      ['src/http/controllers/**', './prisma/vitest-environment-prisma/prisma-test.ts'],
    ],
  },
})
