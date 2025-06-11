import type { Config } from '@jest/types'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

// Add any custom config to be passed to Jest
const config: Config.InitialOptions = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^hooks/(.*)$': '<rootDir>/hooks/$1',
    '^components/(.*)$': '<rootDir>/components/$1',
    '^app/(.*)$': '<rootDir>/app/$1',
    '^types/(.*)$': '<rootDir>/types/$1',
    '^lib/(.*)$': '<rootDir>/lib/$1',
    '^models/(.*)$': '<rootDir>/models/$1',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  },
  // Add more setup options before each test is run
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config)
