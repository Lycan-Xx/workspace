import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/tests/setup.js'],
    include: ['src/tests/**/*.test.js'],
    exclude: ['node_modules', 'dist'],
    testTimeout: 30000, // 30 seconds for auth operations
    hookTimeout: 30000,
    teardownTimeout: 30000,
    // Enable console output during tests
    silent: false,
    reporter: ['verbose', 'json'],
    outputFile: {
      json: './src/tests/test-results.json'
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  define: {
    // Mock environment variables for testing
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(process.env.VITE_SUPABASE_URL || 'http://localhost:5000'),
    'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(process.env.VITE_SUPABASE_ANON_KEY || 'test-key'),
    'import.meta.env.DEV': true,
  },
});