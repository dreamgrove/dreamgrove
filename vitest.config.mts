import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

const root = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  resolve: {
    alias: [
      // The real entry throws outside a React Server Components bundle.
      { find: /^server-only$/, replacement: `${root}node_modules/server-only/empty.js` },
      { find: /^@\//, replacement: root },
    ],
  },
  test: {
    globals: true,
    include: ['__tests__/**/*.test.{ts,tsx,mjs}'],
  },
})
