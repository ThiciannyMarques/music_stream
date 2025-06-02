module.exports = {
  testEnvironment: 'node',
  collectCoverage: true,
  collectCoverageFrom: [
    '**/controllers/**/*.js',
    '**/routes/**/*.js',
    '**/models/**/*.js',
    '!**/node_modules/**',
  ],
  coverageThreshold: {
    global: {
      statements: 25,
      branches: 25,
      functions: 25,
      lines: 25,
    },
  },
};