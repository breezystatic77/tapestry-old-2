import { createNewUser, verifyUser } from './UserController'
import { UserStatus } from '../entity/User'

import { createTestingConnection } from '../../util/testUtils'
import { getConnection } from 'typeorm'

beforeAll(async () => await createTestingConnection())

afterEach(async () => await getConnection().synchronize(true))

afterAll(async () => await getConnection().close())

describe('createNewUser()', () => {
	it('should create a new user', async () => {
		const user = await createNewUser('bobby@gmail.com', 'password1')

		expect(user).toBeDefined()
	})
})

describe('verifyUser()', () => {
	it('changes user to be verified', async () => {
		const user = await createNewUser('bobby@gmail.com', 'password1')

		expect(user.status).toBe(UserStatus.Unverified)

		const verifiedUser = await verifyUser(user.email, user.verifyCode)

		expect(verifiedUser.verifyCode).toBe(null)
		expect(verifiedUser.status).toBe(UserStatus.Verified)
	})

	it('throws on invalid verify code', async () => {
		const user = await createNewUser('bobby@gmail.com', 'password1')

		await expect(verifyUser(user.email, 'wrong code')).rejects.toThrow()
	})

	it('should throw on nonexistent user', async () => {
		await expect(verifyUser('notRealUser@no.gov', '123')).rejects.toThrow()
	})
})
