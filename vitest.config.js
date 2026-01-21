import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    exclude: [
      '**/node_modules/**',
      '**/tests/e2e/**',
      '**/requirements/tests/calculators/**'
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['public/assets/js/**/*.js'],
      exclude: [
        'public/assets/js/vendors/**',
        'public/assets/js/ads/**',
        'public/assets/js/core/ui.js',
        'public/assets/js/core/expression-parser.js',
        '**/node_modules/**',
        '**/tests/**'
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80
      }
    }
  }
});
