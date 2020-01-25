import * as Jwt from 'jsonwebtoken'
import { User } from '../db/entity/User'
import { getConnection } from 'typeorm'
import config from '../util/config'

export const emailPassword = async (
	email: string,
	password: string
): Promise<User> => {
	const c = getConnection()
	const user = await c.getRepository(User).findOne(email)

	if (!user) throw new Error(`No user with email ${email}`)

	const validPass = await user.checkPassword(password)

	if (validPass) return user

	throw new Error('Invalid email or password')
}

export const jwtUser = (token: string): string => {
	const payload = Jwt.verify(token, config.JWT_SECRET)

	if (!payload || !payload['email']) throw new Error('Invalid user token')

	return payload['email']
}

export const jwtCharacter = (token: string): string => {
	const payload = Jwt.verify(token, config.JWT_SECRET)

	if (!payload || !payload['character'])
		throw new Error('Invalid character token')

	return payload['character']
}
