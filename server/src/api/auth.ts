import * as Express from 'express'
import {
	needsEmailPassword,
	needsJwtCharacter,
	needsJwtUser
} from './middleware/needsAuth'
import { ownsCharacter } from '../db/controllers/UserController'
import { getConnection } from 'typeorm'
import { Character } from '../db/entity/Character'

const authRouter = Express.Router()

authRouter.post('/token', needsEmailPassword, (req, res) => {
	// TODO
	res.json({
		token: req.user.createJwt()
	})
})

authRouter.get('/token/:characterId', needsJwtUser, async (req, res) => {
	// TODO

	const c = getConnection()

	const char = await c.getRepository(Character).findOne(req.params.characterId)

	if (!ownsCharacter(req.userEmail, char)) return res.sendStatus(401)

	res.json({
		token: char.createJwt()
	})
})

export default authRouter
