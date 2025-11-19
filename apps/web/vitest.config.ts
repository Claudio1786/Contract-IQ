import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    css: false,
    exclude: [
      'e2e/**',
      'node_modules/**',
      '**/__tests__/contract-*.test.*',
      '**/__tests__/contracts-lib.test.*'
    ],
    coverage: {
      reporter: ['text', 'html']
    }
  }
});