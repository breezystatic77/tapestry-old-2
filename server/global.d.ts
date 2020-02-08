import { Character } from './src/db/entity/Character'
import TapestryServer from './src/TapestryServer'
import { UserStatus } from './src/db/entity/User'

declare global {
	module SocketIO {
		interface Socket {
			character: Character
		}
	}

	module Tapestry {
		type ID = string

		interface IDHaver {
			id: ID
		}

		/** An response body from the Tapestry API */
		type Res<T> = {
			ok: boolean
			errorCode?: number
			errorMessage?: string
			body: T
		}

		interface ApiUser {
			email: string
			status: UserStatus
			characters: { [id: string]: ApiCharacter }
			characterLimit: number
		}

		/** A slimmer version of `ApiCharacter` that doesn't have a status. */
		interface ApiDisplayCharacter extends IDHaver {
			name: string
			color: string
		}
		interface ApiCharacter extends ApiDisplayCharacter {
			status: string
		}
		interface ApiRoom extends IDHaver {
			name: string
			description: string
			persistent: boolean
			owners: { [id: string]: ApiDisplayCharacter }
			moderators: { [id: string]: ApiDisplayCharacter }
			banned: { [id: string]: ApiDisplayCharacter }
			connected: { [id: string]: ApiDisplayCharacter }
		}

		interface ApiUpdateCharacter {
			color: string
			status: string
		}

		// type ChatEvent<E extends ChatEventName, T extends object> = {
		// 	time: Date
		// 	event: E
		// 	data: T
		// }

		interface ChatEvent {
			time?: Date
			event: ChatEventName
			data: object
		}

		type ChatEventName =
			| 'message'
			| 'private-message'
			| 'character-joined'
			| 'character-left'
			| 'character-kicked'
			| 'character-banned'
			| 'character-ownered'
			| 'character-moderatored'
			| 'room-name-changed'
			| 'room-description-changed'
			| 'dice-rolled'

		module ChatEvents {
			interface Message extends ChatEvent {
				event: 'message'
				data: {
					sender: ApiDisplayCharacter
					content: string
				}
			}

			interface PrivateMessage extends ChatEvent {
				event: 'private-message'
				data: {
					sender: ApiDisplayCharacter
					receiver: ApiDisplayCharacter
					content: string
				}
			}

			interface CharacterJoined extends ChatEvent {
				event: 'character-joined'
				data: {
					character: ApiDisplayCharacter
				}
			}
			interface CharacterLeft extends ChatEvent {
				event: 'character-left'
				data: {
					character: ApiDisplayCharacter
				}
			}
			interface CharacterKicked extends ChatEvent {
				event: 'character-kicked'
				data: {
					character: ApiDisplayCharacter
					doer: ApiDisplayCharacter
					reason: string
				}
			}
			interface CharacterBanned extends ChatEvent {
				event: 'character-banned'
				data: {
					character: ApiDisplayCharacter
					doer: ApiDisplayCharacter
					reason: string
				}
			}
			interface CharacterOwnered extends ChatEvent {
				event: 'character-ownered'
				data: {
					character: ApiDisplayCharacter
					doer: ApiDisplayCharacter
				}
			}
			interface CharacterModeratored extends ChatEvent {
				event: 'character-moderatored'
				data: {
					character: ApiDisplayCharacter
					doer: ApiDisplayCharacter
				}
			}
			interface RoomNameChanged extends ChatEvent {
				event: 'room-name-changed'
				data: {
					oldName: string
					newName: string
				}
			}
			interface RoomDescriptionChanged extends ChatEvent {
				event: 'room-description-changed'
				data: {
					oldDescription: string
					newDescription: string
				}
			}
			interface DiceRolled extends ChatEvent {
				event: 'dice-rolled'
				data: {
					roller: ApiDisplayCharacter
					rollString: string
					results: number[]
					sum: number
				}
			}
		}
	}
}
