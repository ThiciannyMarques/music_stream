import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      all: true,
      include: ['src/**/*.{js,vue}'],
      exclude: ['src/main.js'],
      thresholds: {
        lines: 25,
        functions: 25,
        branches: 25,
        statements: 25
      }
    }
  }
})
