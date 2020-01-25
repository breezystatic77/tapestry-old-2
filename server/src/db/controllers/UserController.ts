import { User, UserStatus } from '../entity/User'
import { getConnection } from 'typeorm'
import { Character } from '../entity/Character'

/**
 * Create and save a new user to the db
 */
export const createNewUser = async (email: string, password: string) => {
	const user = new User()

	user.email = email
	user.status = UserStatus.Unverified
	await user.hashPassword(password)

	await user.validate()

	const existingUser = await getConnection()
		.getRepository(User)
		.findOne({
			email: email
		})

	if (existingUser) throw new Error(`Email ${email} already in use`)

	return await getConnection()
		.getRepository(User)
		.save(user)
}
/**
 * Attempts to change a User record to be verified,
 * based on the supplied verified code.
 *
 * Throws if verification fails.
 */
export const verifyUser = async (email: string, verifyCode: string) => {
	const c = getConnection()

	const user = await c.getRepository(User).findOne(email)

	if (user.verifyCode !== verifyCode)
		throw new Error('invalid verify code in verifyUser')

	user.status = UserStatus.Verified

	user.verifyCode = null

	return await c.manager.save(user)
}
/**
 * Changes status of a user in the db
 */
export const setUserStatus = async (email: string, status: UserStatus) => {
	const c = getConnection()

	const user = await c.getRepository(User).findOne(email)

	user.status = status

	return await c.getRepository(User).save(user)
}

/**
 * Returns whether user of given email owns character of given id.
 * Also returns false if character does not exist.
 *
 * Throws if user does not exist.
 */
export const ownsCharacter = async (email: string, character: Character) => {
	const c = getConnection()

	const user = await c.getRepository(User).findOne(email)

	try {
		const chars = await user.characters
		return chars.includes(character)
	} catch (err) {
		return false
	}
}
