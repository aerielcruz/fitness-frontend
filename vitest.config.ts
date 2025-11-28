import { defineConfig, mergeConfig } from 'vitest/config'
import path from 'path';
import viteConfig from './vite.config.ts'

export default mergeConfig(viteConfig, defineConfig({
  test: {
    globals: true,          // use global test APIs like describe, it, expect
    environment: 'node',   // simulate browser environment
    setupFiles: './src/setupTests.ts', // optional setup file
  },
  resolve: {
    alias: {
      '@/': path.resolve(__dirname, 'src'),
    },
  },
}))