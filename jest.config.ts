import { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "jest-environment-jsdom",
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  moduleDirectories: ["./app/javascript/", "node_modules"],
  setupFilesAfterEnv: ["<rootDir>/setup-jest.ts"],
};

export default config;
