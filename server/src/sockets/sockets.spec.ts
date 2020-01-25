import * as io from 'socket.io-client'

import { testingServer, populateWithTestingData } from '../util/testUtils'

import { getRepository } from 'typeorm'
import { User } from '../db/entity/User'
import { Character } from '../db/entity/Character'
import { wait, ResponseJson } from '../util/utils'
import TapestryServer from '../TapestryServer'

let server: TapestryServer

let socket: SocketIOClient.Socket

let token: string

beforeAll(async () => {})

afterAll(async () => {})

beforeEach(async () => {
	server = testingServer()
	await server.listen()

	const { testUser, testCharacter } = await populateWithTestingData()

	token = testCharacter.createJwt()

	socket = io('http://localhost:7777', {
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

describe('authentication', () => {
	it('does authentication handshake', done => {
		expect(server.connectedCharacters).toBe(0)
		socket.on('connect', () => {
			socket.emit('to-server-handshake', {
				token
			})
		})

		socket.on('to-client-handshake', async (data: any) => {
			console.log(data)
			expect(data.success).toBe(true)
			expect(server.connectedCharacters).toBe(1)
			done()
		})
	})

	it.skip('times out with no handshake', done => {
		socket.on('to-client-error', error => {
			expect(error.message).toBe('handshake timed out')
			done()
		})
	})
})
