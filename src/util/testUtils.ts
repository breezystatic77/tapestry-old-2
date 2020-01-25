import TapestryServer from '../TapestryServer'
import { ConnectionOptions, createConnection, getRepository } from 'typeorm'
import { User, UserStatus } from '../db/entity/User'
import { Character } from '../db/entity/Character'

import * as io from 'socket.io-client'

export const testingDbOptions: ConnectionOptions = {
	type: 'sqlite',
	database: ':memory:',
	dropSchema: true,
	synchronize: true,
	logging: false,
	entities: ['src/db/entity/**/!(*.spec).ts'],
	migrations: ['src/db/migration/**/!(*.spec).ts'],
	subscribers: ['src/db/subscribers/**/!(*.spec).ts']
}

export const testingServer = () => {
	return new TapestryServer({
		port: 7777,
		dbOptions: testingDbOptions
	})
}

export const createTestingConnection = () => {
	return createConnection(testingDbOptions)
}

export const populateWithTestingData = async () => {
	const userRepo = getRepository(User)
	const characterRepo = getRepository(Character)

	const testUser = new User()
	testUser.email = 'jebaited@lmao.gov'
	await testUser.hashPassword('password')
	testUser.status = UserStatus.Verified

	await userRepo.save(testUser)

	const testCharacter = new Character('Puddle', testUser)

	await characterRepo.save(testCharacter)

	return {
		testUser,
		testCharacter
	}
}

export const testingClient = (): SocketIOClient.Socket =>
	io('http://localhost:7777', {
		reconnectionAttempts: 0,
		timeout: 1000,
		forceNew: true,
		autoConnect: true,
		transportOptions: {
			polling: {
				extraHeaders: {
					Authorization: 'Bearer hi:)'
				}
			}
		}
	})

export const testingClientAuth = (
	token: string
): Promise<SocketIOClient.Socket> => {
	return new Promise((resolve, reject) => {
		const socket = io('http://localhost:7777', {
			reconnectionAttempts: 0,
			timeout: 1000,
			forceNew: true,
			autoConnect: true,
			transportOptions: {
				polling: {
					extraHeaders: {
						Authorization: 'Bearer hi:)'
					}
				}
			}
		})

		socket.on('connect', () => {
			socket.emit('to-server-handshake', {
				token
			})
		})

		socket.on('to-client-handshake', async (data: any) => {
			resolve(socket)
		})

		socket.on(
			'to-client-error',
			(err: { error: boolean; name: string; message: string }) => {
				reject(err)
			}
		)
	})
}
