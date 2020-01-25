import TapestryServer from '../TapestryServer'
import * as Express from 'express'
import { User } from '../db/entity/User'
import { getConnection } from 'typeorm'
import { createNewUser } from '../db/controllers/UserController'
import authRouter from './auth'
import { resJson, resJsonError } from '../util/utils'
import characterRouter from './characterRouter'
import { needsJwtUser } from './middleware/needsAuth'

const initApi = (server: TapestryServer): Express.Router => {
	const api = Express.Router()

	api.use(Express.json())

	api.use('/auth', authRouter)

	api.get('/version', (req, res) => {
		res.json(resJson({ version: '1.0' }))
	})

	api.get('/connected_characters', (req, res) => {
		res.json(
			resJson({
				connected_characters: server.io.clients.length
			})
		)
	})

	api.post('/register', async (req, res) => {
		const email: string = req.body.email
		const password: string = req.body.password

		try {
			const newUser = await createNewUser(email, password)
			res.status(200).json(
				resJson({
					user: newUser.toApiUser()
				})
			)
		} catch (err) {
			res.status(400).json(resJsonError(0, err.message))
		}
	})

	api.use('/character', characterRouter)

	api.use('/me', needsJwtUser, async (req, res) => {
		const email = req.userEmail
		const user = await getConnection()
			.getRepository(User)
			.findOne(email)

		res.json(
			resJson({
				me: user.toApiUser()
			})
		)
	})

	return api
}

export default initApi
