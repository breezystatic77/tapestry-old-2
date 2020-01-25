import * as Express from 'express'
import * as Jwt from 'jsonwebtoken'
import { getConnection } from 'typeorm'
import config from '../../util/config'
import { User } from '../../db/entity/User'
import { Character } from '../../db/entity/Character'

import { emailPassword, jwtUser, jwtCharacter } from '../../auth/auth'
import { resJsonError } from '../../util/utils'

/**
 * Character auth system is too complicated for passportjs.
 * We will use our own
 */
declare global {
	namespace Express {
		interface Request {
			user: User
			userEmail: string
			characterId: string
		}
	}
}

/**
 * expess middleware for when an email and password are needed.
 * Sets `req.user`
 */
export const needsEmailPassword = async (
	req: Express.Request,
	res: Express.Response,
	next: Express.NextFunction
) => {
	if (!req.body.email || !req.body.password) {
		return res.sendStatus(400)
	}
	const email: string = req.body.email
	const password: string = req.body.password

	try {
		const user = await emailPassword(email, password)
		req.user = user
		next()
	} catch (err) {
		res.status(401).send(resJsonError(0, err.message))
	}
}

const getToken = (req: Express.Request): string => {
	if (
		req.headers.authorization &&
		req.headers.authorization.split(' ')[0] === 'Bearer'
	) {
		return req.headers.authorization.split(' ')[1]
	} else {
		return undefined
	}
}

/**
 * expess middleware for when a user-level jwt token is needed.
 * Makes no request to database.
 * Sets `req.userEmail`
 */
export const needsJwtUser = (
	req: Express.Request,
	res: Express.Response,
	next: Express.NextFunction
) => {
	const token = getToken(req)
	if (!token) return res.status(401).send(resJsonError(0, `needs user token`))

	try {
		const email = jwtUser(token)
		req.userEmail = email
		next()
	} catch (err) {
		res.status(401).send(resJsonError(0, `invalid user token`))
	}
}

/**
 * expess middleware for when a character-level jwt token is needed.
 * Makes no request to database.
 * Sets `req.characterId`
 */
export const needsJwtCharacter = (
	req: Express.Request,
	res: Express.Response,
	next: Express.NextFunction
) => {
	const token = getToken(req)
	if (!token)
		return res.status(401).send(resJsonError(0, `needs character token`))

	try {
		const characterId = jwtCharacter(token)
		req.characterId = characterId
		next()
	} catch (err) {
		res.status(401).send(resJsonError(0, `invalid character token`))
	}
}
