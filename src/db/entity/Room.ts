import {
	Entity,
	PrimaryColumn,
	Column,
	ManyToMany,
	JoinTable,
	PrimaryGeneratedColumn
} from 'typeorm'
import { Character } from './Character'
import TapestryServer from '../../TapestryServer'
import { resJson, idArrayToObject, roomSocketName } from '../../util/utils'

@Entity()
export class Room {
	@PrimaryGeneratedColumn('uuid')
	id: string

	@Column({ unique: true })
	// @PrimaryColumn()
	// TODO room name validation
	name: string

	@Column()
	// TODO room description validation
	description: string = ''

	@Column()
	persistent: boolean = false

	@ManyToMany(type => Character)
	@JoinTable()
	owners: Promise<Character[]>

	@ManyToMany(type => Character)
	@JoinTable()
	moderators: Promise<Character[]>

	@ManyToMany(type => Character)
	@JoinTable()
	bannedCharacters: Promise<Character[]>

	constructor(name: string, owner: Character) {
		this.name = name
		this.owners = Promise.resolve([owner])
	}

	async addOwner(owner: Character) {
		const owners = await this.owners
		this.owners = Promise.resolve([...owners, owner])
	}

	async addModerator(moderator: Character) {
		const moderators = await this.moderators
		this.moderators = Promise.resolve([...moderators, moderator])
	}

	async banCharacter(banned: Character) {
		const bannedCharacters = await this.bannedCharacters
		this.bannedCharacters = Promise.resolve([...bannedCharacters, banned])
	}

	/**
	 * Kicks everyone out of a room.
	 * If it's not persistent, it's deleted.
	 * Does nothing if the server has nobody in it.
	 */
	async close() {
		const socketRoom = this.socketRoom()
		if (!socketRoom || socketRoom.length <= 0) return

		for (const socket of this.connectedSockets()) {
			socket.leave(roomSocketName(this.id), () => {
				socket.send(
					'to-client-kicked',
					resJson({
						room: this.name,
						reason: 'room closed'
					})
				)
			})
		}

		// TODO delete non-persistent room
	}

	async toApiRoom(): Promise<Tapestry.ApiRoom> {
		const charMap = async (chars: Promise<Character[]>) =>
			idArrayToObject((await chars).map(c => c.toApiCharacter()))

		const res: Tapestry.ApiRoom = {
			id: this.id,
			name: this.name,
			description: this.description,
			persistent: this.persistent,
			owners: {},
			moderators: {},
			banned: {},
			connected: {}
		}

		await Promise.all([
			async () => (res.owners = await charMap(this.owners)),
			async () => (res.owners = await charMap(this.moderators)),
			async () => (res.banned = await charMap(this.bannedCharacters))
		])

		return res
	}

	socketName(): string {
		return roomSocketName(this.id)
	}

	socketRoom(): SocketIO.Room {
		return TapestryServer.server.io.sockets.adapter.rooms[
			roomSocketName(this.id)
		]
	}

	connectedSockets(): SocketIO.Socket[] {
		const socketRoom = this.socketRoom()

		if (!socketRoom) return []

		return Object.keys(socketRoom.sockets).map(
			socketId => TapestryServer.server.io.sockets.connected[socketId]
		)
	}

	/** Returns an array of connected characters. */
	connectedCharacters(): Character[] {
		const socketRoom = this.socketRoom()

		if (!socketRoom) return []

		return this.connectedSockets().map(socket => socket.character)
	}

	/** returns the number of connected users, 0 if no socket room exists */
	connectedSocketCount(): number {
		const socketRoom = this.socketRoom()

		if (!socketRoom) return 0

		return socketRoom.length
	}

	/** returns true if there are no connected sockets and the room is not persistent */
	shouldDelete(): boolean {
		return this.connectedSocketCount() <= 0 && !this.persistent
	}
}
