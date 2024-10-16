module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom", // If you're testing React components
  setupFilesAfterEnv: ["<rootDir>/setupTests.ts"],
  transform: {
    "^.+\\.tsx?$": "ts-jest", // Transform TypeScript files
    "^.+\\.(js|jsx)$": "babel-jest", // Transform JavaScript files
  },
  moduleNameMapper: {
    "\\.(css|less|sass|scss)$": "identity-obj-proxy", // Optional: mock styles
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testPathIgnorePatterns: ["/node_modules/", "<rootDir>/.next/"],
};
