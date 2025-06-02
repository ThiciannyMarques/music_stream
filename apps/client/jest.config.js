module.exports = {
  preset: '@vue/cli-plugin-unit-jest',
  testMatch: ['**/*.spec.js'],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/components/**/*.{js,vue}',
    'src/App.vue',
    '!**/node_modules/**'
  ],
  coverageThreshold: {
    global: {
      branches: 25,
      functions: 25,
      lines: 25,
      statements: 25
    }
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  }
}