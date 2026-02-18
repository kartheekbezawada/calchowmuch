import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['tests_specs/**/*.test.js'],
    exclude: [
      '**/node_modules/**',
      '**/*.spec.js',
      '**/tests_specs/**/e2e/**',
      '**/tests_specs/**/cluster_release/**/*.spec.js',
      '**/tests_specs/**/*_release/**/*.spec.js',
      '**/*-snapshots/**',
      '**/test-results/**',
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
        '**/tests_specs/**',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
});
