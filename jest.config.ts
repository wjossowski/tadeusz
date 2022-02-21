import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  verbose: true,
  modulePathIgnorePatterns: ["<rootDir>/dist/"],
  moduleNameMapper: {
    "@common/(.*)": "<rootDir>/src/common/$1",
    "@music/(.*)": "<rootDir>/src/music/$1",
  },
};

export default config;
