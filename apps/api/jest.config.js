const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig');

module.exports = {
  rootDir: '.',
  testPathIgnorePatterns: ['/node_modules/'],
  moduleFileExtensions: ['js', 'json', 'ts'],
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  // collectCoverageFrom: [
  //   'src/**/*',
  //   '!misc/**/*',
  //   '!src/db/**/*',
  //   '!src/*.ts',
  //   '!src/middlewares/{(morgan),}.ts',
  //   '!src/utils/{(logger),}.ts',
  //   '!src/setup/{(db),}.ts',
  // ],
  // setupFilesAfterEnv: ['<rootDir>/__tests__/setup/setupAfterEnv.ts'],
  // globalSetup: '<rootDir>/__tests__/setup/globalSetup.ts',
  // globalTeardown: '<rootDir>/__tests__/setup/globalTeardown.ts',
  // coverageThreshold: {
  //   global: {
  //     branches: 50,
  //     functions: 50,
  //     lines: 50,
  //     statements: 50,
  //   },
  // },
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
  modulePaths: [compilerOptions.baseUrl],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
};
