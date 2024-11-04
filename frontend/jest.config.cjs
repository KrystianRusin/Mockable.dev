/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest', // Utilize ts-jest preset for TypeScript
  testEnvironment: 'jsdom', // Simulate browser environment
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'], // Setup Jest DOM matchers
  transform: {
    '^.+\\.tsx?$': 'ts-jest', // Transform TypeScript files using ts-jest
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy', // Mock CSS modules
  },
  testPathIgnorePatterns: ['/node_modules/', '/dist/'], // Ignore these directories
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'], // Supported file extensions
};
