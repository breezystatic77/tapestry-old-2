import { Room } from '../entity/Room'
import { Character } from '../entity/Character'
import { getConnection } from 'typeorm'
import TapestryServer from '../../TapestryServer'

export const createRoom = async (name: string, owner: Character) => {
	const c = getConnection()

	const room = new Room(name, owner)

	return await c.getRepository(Room).save(room)
}

export const roomExists = async (name: string) => {
	const c = getConnection()

	const room = await c.getRepository(Room).findOne({ name })
	return !!room
}

export const shouldDeleteRoom = async (room: Room): Promise<boolean> => {
	const ioRoom =
		TapestryServer.server.io.sockets.adapter.rooms[room.socketName()]

	return (!ioRoom || ioRoom.length <= 0) && !room.persistent
}
