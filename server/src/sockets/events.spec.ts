import * as io from 'socket.io-client'

import TapestryServer from '../TapestryServer'
import {
	testingServer,
	populateWithTestingData,
	testingClient
} from '../util/testUtils'

import { getRepository } from 'typeorm'
import { User } from '../db/entity/User'
import { Character } from '../db/entity/Character'
import { wait } from '../util/utils'

let server: TapestryServer

let socket: SocketIOClient.Socket

let token: string

beforeEach(async () => {
	server = testingServer()
	await server.listen()

	const { testUser, testCharacter } = await populateWithTestingData()

	token = testCharacter.createJwt()

	socket = testingClient()

	socket.on('error', (error: Error) => {
		throw error
	})

	socket.on('connect_error', (error: Error) => {
		throw error
	})

	socket.on('connect_timeout', () => {
		throw new Error('socket timeout')
	})
})

afterEach(async () => {
	if (socket) socket.close()
	await server.close()
})

describe('creating rooms', () => {
	it('create a room', done => {
		done()
	})
})
