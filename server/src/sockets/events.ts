import * as SocketIO from 'socket.io'
import TapestryServer from '../TapestryServer'

import { resJson, resJsonOk, resJsonError, socketError } from '../util/utils'
import { Character } from '../db/entity/Character'
import { createRoom, roomExists } from '../db/controllers/RoomController'
import { getConnection } from 'typeorm'
import { Room } from '../db/entity/Room'
import {
	sendEventToRoom,
	sendPrivateMessage,
	sendRoomMessage
} from './chatController'

const events = (server: TapestryServer, socket: SocketIO.Socket) => {
	// events for socket go here
	// throw new Error('nice')

	/** Sends an error to this specific socket. */
	const sendError = (name: string, message: string): boolean => {
		return socket.emit('to-client-error', socketError(name, message))
	}

	socket.emit('to-client-welcome', resJson({ welcome: 'hi :)' }))

	socket.on('to-server-create-room', async (body: { name: string }) => {
		const room = await createRoom(body.name, socket.character)
		socket.character.joinRoom(room)
	})

	socket.on('to-server-join-room', async (body: { id: string }) => {
		const c = getConnection()
		const room = await c.getRepository(Room).findOne(body.id)

		if (room) socket.character.joinRoom(room)
		else sendError('join room failed', 'room does not exist')
	})

	socket.on('to-server-leave-room', async (body: { id: string }) => {
		const c = getConnection()
		const room = await c.getRepository(Room).findOne(body.id)

		socket.character.leaveRoom(room)
	})

	socket.on(
		'to-server-send-message',
		async (body: { room: string; content: string }) => {
			if (body.content[0] == '/') {
				// TODO handle commands
			}

			if (!socket.rooms[body.room])
				return sendError('message unsent', 'you are not in that room')

			const c = getConnection()
			const room = await c.getRepository(Room).findOne(body.room)

			const sent = sendRoomMessage(room, socket.character, body.content)
		}
	)

	socket.on(
		'to-server-send-pm',
		async (body: { receiverId: string; content: string }) => {
			if (body.content[0] == '/') {
				// TODO handle commands
			}

			const c = getConnection()

			const receiver = await c.getRepository(Character).findOne(body.receiverId)

			socket.character.messageCharacter(receiver, body.content)
		}
	)
}

export default events
