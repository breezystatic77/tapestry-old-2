import { Character } from './Character'
import { User } from './User'
import TapestryServer from '../../TapestryServer'
import {
	testingServer,
	populateWithTestingData,
	testingClient,
	testingClientAuth
} from '../../util/testUtils'
import { createRoom } from '../controllers/RoomController'

it('should create a character without crashing', () => {
	const u = new User()
	const c = new Character('Puddle', u)

	expect(c).toBeDefined()
})

describe('Character field validation', () => {
	const u = new User()

	const c = new Character('Puddle', u)

	it('should validate names', async () => {
		await expect(c.validate()).resolves.not.toThrow()
	})

	// TODO more validation
})

it('toApiCharacter()', () => {
	const u = new User()
	const c = new Character('Puddle', u)
	expect(c.toApiCharacter()).toEqual({
		id: undefined,
		name: c.name,
		color: c.color,
		status: c.status
	})
})

it('toDisplayCharacter()', () => {
	const u = new User()
	const c = new Character('Puddle', u)
	expect(c.toDisplayCharacter()).toEqual({
		id: undefined,
		name: c.name,
		color: c.color
	})
})

describe('websocket methods', () => {
	let server: TapestryServer

	let socket: SocketIOClient.Socket

	let token: string

	let user: User

	let character: Character

	beforeEach(async () => {
		server = testingServer()
		await server.listen()

		const { testUser, testCharacter } = await populateWithTestingData()
		user = testUser
		character = testCharacter

		token = character.createJwt()

		socket = await testingClientAuth(token)

		character.socketId = socket.id
	})

	afterEach(async () => {
		if (socket) socket.close()
		await server.close()
	})

	it('connects', async () => {
		// await testingClientAuth(token)
	})

	it('joins a room', async done => {
		const room = await createRoom('puddles room', character)

		character.joinRoom(room)

		socket.on('to-client-room-joined', ({ id }) => {
			done()
		})
	})

	it('leaves a room', async done => {
		const room = await createRoom('puddles room', character)

		character.joinRoom(room)

		socket.on('to-client-room-joined', ({ id }) => {
			character.leaveRoom(room)
			socket.on('to-client-room-left', ({ id }) => {
				done()
			})
		})
	})

	it('sends a message in a room', async done => {
		const room = await createRoom('puddles room', character)

		character.joinRoom(room)

		socket.on('to-client-room-joined', ({ id }) => {
			const message = 'haha yes'

			character.messageRoom(room, message)

			const e = jest.fn()

			socket.on('to-client-room-event', event => {
				e(event)
				if (e.mock.calls.length == 2) {
					// #1: joining the room
					expect(e.mock.calls[0][0]).toMatchObject({
						event: 'character-joined',
						data: {
							character: character.toDisplayCharacter()
						}
					})
					// #2 : the message sent
					expect(e.mock.calls[1][0]).toMatchObject({
						event: 'message',
						data: {
							sender: character.toDisplayCharacter(),
							content: message
						}
					})
					done()
				}
			})
		})
	})
})
