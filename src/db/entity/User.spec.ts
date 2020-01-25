import { User } from './User'

it('should create a user without crashing', () => {
	const u = new User()
	expect(u).toBeDefined()
})

describe('User field validation', () => {
	it('should only accept emails', async () => {
		const u = new User()

		u.email = 'bobby@gmail.com'

		await expect(u.validate()).resolves.not.toThrow()

		u.email = 'not an email :)'

		await expect(u.validate()).rejects.toThrow()
	})
})
