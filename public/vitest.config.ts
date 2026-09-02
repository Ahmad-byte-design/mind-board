import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    globals: false,
    setupFiles: ['src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    css: false,
    restoreMocks: true,
    clearMocks: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/features/**', 'src/lib/**', 'src/hooks/**'],
      exclude: [
        '**/__tests__/**',
        'src/features/**/index.ts',
        '**/*.constants.ts',
        '**/*.types.ts',
        '**/*.d.ts',
      ],
    },
  },
})