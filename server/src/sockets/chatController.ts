import * as SocketIO from 'socket.io'
import { Character } from '../db/entity/Character'
import { resJson, roomIdFromSocketName } from '../util/utils'
import { Room } from '../db/entity/Room'
import TapestryServer from '../TapestryServer'

export const sendEventToRoom = <E extends Tapestry.ChatEvent>(
	room: Room,
	event: E
): boolean => {
	const res: E = {
		time: new Date(),
		...event
	}

	return TapestryServer.server.io
		.to(room.socketName())
		.emit('to-client-room-event', res)
}

export const sendEventToCharacter = <E extends Tapestry.ChatEvent>(
	character: Character,
	event: E
): boolean => {
	const res: E = {
		time: event.time || new Date(),
		...event
	}

	return TapestryServer.server.io
		.to(character.socketId)
		.emit('to-client-room-event', res)
}

export const sendRoomMessage = (
	room: Room,
	sender: Character,
	content: string
): boolean => {
	const res: Tapestry.ChatEvents.Message = {
		event: 'message',
		data: {
			sender: sender.toDisplayCharacter(),
			content
		}
	}
	return sendEventToRoom(room, res)
}

export const sendPrivateMessage = (
	receiver: Character,
	sender: Character,
	content: string
): boolean => {
	const res: Tapestry.ChatEvents.PrivateMessage = {
		time: new Date(), // make sure the timestamp matches up on both
		event: 'private-message',
		data: {
			sender: sender.toDisplayCharacter(),
			receiver: receiver.toDisplayCharacter(),
			content
		}
	}
	sendEventToCharacter(sender, res)
	return sendEventToCharacter(receiver, res)
}

/**
 * Returns a dictionary of all open room names and the number of users in them.
 */
export const roomSockets = (io: SocketIO.Server) => {
	return (
		Object.keys(io.sockets.adapter.rooms)
			// only use chat rooms, which start with a prefix
			.filter(key => key.substr(0, 5) === 'room:')
			.reduce((obj: { [k: string]: number }, key) => {
				// add the number of connected sockets
				obj[roomIdFromSocketName(key)] = Object.keys(
					io.sockets.adapter.rooms[key].sockets
				).length
				return obj
			}, {})
	)
}
