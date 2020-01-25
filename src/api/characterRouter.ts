import * as Express from 'express'

import { needsJwtCharacter, needsJwtUser } from './middleware/needsAuth'
import { getConnection } from 'typeorm'
import { User } from '../db/entity/User'
import { createNewCharacter } from '../db/controllers/CharacterController'
import { resJson, resJsonError, resJsonOk } from '../util/utils'
import { Character } from '../db/entity/Character'
import { ownsCharacter } from '../db/controllers/UserController'

const characterRouter = Express.Router()

characterRouter.post('/', needsJwtUser, async (req, res) => {
	const { name } = req.body

	const user = await getConnection()
		.getRepository(User)
		.findOne(req.userEmail)

	try {
		const newCharacter = await createNewCharacter(name, user)

		res.json(resJson(newCharacter.toApiCharacter()))
	} catch (err) {
		res.json(resJsonError(0, err.message))
	}
})

characterRouter.get('/:characterId', async (req, res) => {
	const name = req.params.characterId

	const character = await getConnection()
		.getRepository(Character)
		.findOne({
			name
		})

	if (character) res.json(resJson(character.toApiCharacter()))
	else res.status(404).json(resJsonError(0, `Character ${name} does not exist`))
})

characterRouter.put('/:characterId', needsJwtCharacter, async (req, res) => {
	if (req.params.characterId != req.characterId)
		res
			.status(403)
			.json(resJsonError(0, `Not authorized to edit this character`))
})

characterRouter.delete('/:characterId', needsJwtUser, async (req, res) => {
	const { name } = req.body

	const character = await getConnection()
		.getRepository(Character)
		.findOne(req.params.characterId)

	if (!character)
		return res
			.status(404)
			.send(resJsonError(0, `Character ${name} does not exist`))

	if (!name || name !== character.name)
		return res
			.status(401)
			.send(resJsonError(0, `Needs name to validate character deletion`))

	const doesOwn = await ownsCharacter(req.userEmail, character)

	if (!doesOwn)
		return res
			.status(403)
			.send(
				resJsonError(
					0,
					`You do not own this character, please do not try to delete it.`
				)
			)

	await getConnection()
		.getRepository(Character)
		.delete(req.params.characterId)

	res.send(resJsonOk())
})

export default characterRouter
