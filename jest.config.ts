import { Config } from "@jest/types";

const config: Config.InitialOptions = {
  testEnvironment: "node",
  moduleFileExtensions: ["js", "json", "ts"],
  roots: ["<rootDir>/src"],
  testRegex: ".*\\.spec\\.ts$",
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
  collectCoverageFrom: [
    "src/**/*.{ts,tsx,js,jsx}",
    "!src/**/*.d.ts",
    "!src/**/*.spec.{js,ts}",
    "!src/**/*.test.{js,ts}",
  ],
  coverageDirectory: "./coverage",
  resetModules: true,
};

export default config;
