import defaultConfig from './jest.config'
import { Config } from '@jest/types'

const config: Config.InitialOptions = {
	...defaultConfig,
	roots: ['<rootDir>/test'],
	testRegex: ['.e2e-spec.ts$'],
	globalSetup: '<rootDir>/test/config/global.setup.ts',
	setupFiles: ['<rootDir>/test/config/environment.ts'],
	globalTeardown: '<rootDir>/test/config/global.teardown.ts',
}

export default config
