module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/*.test.js'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/build/',
    '/android/',
    '/ios/'
  ],
  moduleFileExtensions: ['js', 'ts', 'json', 'node']
};