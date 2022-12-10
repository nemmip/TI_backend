import { exec } from 'child_process'

const setup = () => {
	beforeAll(() => {
		exec('yarn start:db')
	})

	afterAll(() => {
		exec('yarn migration:reset && stop:db')
	})
}

export default setup
