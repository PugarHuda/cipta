/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.ts"],
  // Allow ts-jest to transform viem (ESM package)
  transformIgnorePatterns: [
    "node_modules/(?!(viem|@viem|abitype|isbot)/)",
  ],
  transform: {
    "^.+\\.tsx?$": ["ts-jest", {
      tsconfig: {
        module: "CommonJS",
        esModuleInterop: true,
      },
    }],
    "^.+\\.mjs$": ["ts-jest", {
      tsconfig: {
        module: "CommonJS",
        esModuleInterop: true,
      },
    }],
  },
  coverageDirectory: "coverage",
  collectCoverageFrom: ["src/**/*.ts", "!src/**/__tests__/**"],
}
