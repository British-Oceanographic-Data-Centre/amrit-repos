const config = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    globals: {
      'ts-jest': {
        tsconfig: 'tsconfig.jest.json',
      },
    },
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/$1',
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    },
    transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest',
    },
  };

  export default config;
  