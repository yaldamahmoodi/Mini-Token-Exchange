import type { Config } from "jest";

const config: Config = {
    preset: "ts-jest",
    testEnvironment: "node",
    roots: ["<rootDir>/src", "<rootDir>/src/tests"],
    testMatch: ["**/?(*.)+(spec|test).[jt]s?(x)"],
};

export default config;
