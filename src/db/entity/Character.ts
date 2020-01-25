import {
	Entity,
	PrimaryColumn,
	Column,
	ManyToOne,
	PrimaryGeneratedColumn,
	getRepository,
	getConnection,
	ManyToMany
} from 'typeorm'
import { validate } from 'class-validator'
import * as Jwt from 'jsonwebtoken'
import { User } from './User'
import config from '../../util/config'
import TapestryServer from '../../TapestryServer'
import { Room } from './Room'
import {
	sendEventToRoom,
	sendRoomMessage,
	sendPrivateMessage
} from '../../sockets/chatController'
import { socketError } from '../../util/utils'

@Entity()
export class Character {
	@PrimaryGeneratedColumn('uuid')
	id: string

	@Column({ unique: true })
	// TODO name validation
	// needs a pretty strict regex
	name: string

	@Column()
	// TODO color validation
	// implement color limiting
	color: string

	@Column()
	// TODO status validation
	status: string

	@ManyToOne(
		type => User,
		user => user.characters
	)
	// TODO must exist validation
	owner: Promise<User>

	@ManyToMany(type => Character)
	friends: Promise<Character[]>

	@ManyToMany(
		type => User,
		user => user.blocked
	)
	blockedBy: Promise<User[]>

	socketId: string

	/** Does NOT validate, use `validate()` */
	constructor(name: string, owner: User) {
		this.name = name
		this.owner = Promise.resolve(owner)
		this.color = '#000000'
		this.status = ''
	}

	async validate(): Promise<void> {
		const errors = await validate(this)
		if (errors.length > 0) {
			throw new Error(`Validation failed: ${errors}`)
		}
	}

	async ownerIsVerified(): Promise<boolean> {
		// TODO: check owner acc is verified
		// meaning not unverified and not banned or whatever
		return true
	}

	/**
	 * Attempts to edit and validate afterwards, then save.
	 * Only accepts fields that a user can edit.
	 */
	async edit(props: Tapestry.ApiUpdateCharacter): Promise<Character> {
		this.color = props.color
		this.status = props.status

		await this.validate()

		return await getConnection()
			.getRepository(Character)
			.save(this)
	}

	createJwt(): string {
		return Jwt.sign(
			{
				character: this.id
			},
			config.JWT_SECRET
		)
	}

	toApiCharacter(): Tapestry.ApiCharacter {
		return {
			id: this.id,
			name: this.name,
			color: this.color,
			status: this.status
		}
	}

	toDisplayCharacter(): Tapestry.ApiDisplayCharacter {
		return {
			id: this.id,
			name: this.name,
			color: this.color
		}
	}

	socket(): SocketIO.Socket {
		return TapestryServer.server.io.sockets.connected[this.socketId]
	}

	isInRoom(room: Room): boolean {
		return !!this.socket().rooms[room.socketName()]
	}

	sendError(name: string, message: string) {
		this.socket().emit('to-client-error', socketError(name, message))
	}

	joinRoom(room: Room) {
		this.socket().join(room.socketName())
		this.socket().emit('to-client-room-joined', {
			id: room.id
		})
		sendEventToRoom(room, <Tapestry.ChatEvents.CharacterJoined>{
			event: 'character-joined',
			data: {
				character: this.toDisplayCharacter()
			}
		})
	}

	leaveRoom(room: Room) {
		if (!this.isInRoom(room))
			return this.sendError(
				'leave room failed',
				`you are not in the room ${room.name}`
			)
		this.socket().leave(room.socketName())
		this.socket().emit('to-client-room-left', {
			id: room.id
		})
		sendEventToRoom(room, <Tapestry.ChatEvents.CharacterLeft>{
			event: 'character-left',
			data: {
				character: this.toDisplayCharacter()
			}
		})
	}

	messageRoom(room: Room, content: string) {
		if (!this.isInRoom(room))
			return this.sendError(
				'message failed',
				`you are not in the room ${room.name}`
			)

		const sent = sendRoomMessage(room, this, content)

		if (!sent)
			this.sendError(
				'message unsent',
				`message to room ${room.name} failed to send`
			)
	}

	messageCharacter(character: Character, content: string) {
		if (!character.socket())
			return this.sendError('message failed', `${character.name} is offline`)

		const sent = sendPrivateMessage(character, this, content)

		if (!sent)
			this.sendError(
				'message unsent',
				`message to ${character.name} failed to send`
			)
	}
}

export const getFromJwt = async (
	token: string
): Promise<Character | undefined> => {
	const r = getRepository(Character)

	try {
		const id: string = Jwt.verify(token, config.JWT_SECRET)['character']

		const character = await r.findOne(id)

		return character
	} catch (err) {
		console.warn(err.message)
		return undefined
	}
}
