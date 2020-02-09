import React, { useState } from 'react'

import { apiCall } from '../controllers/ApiController'
import { io, initIo } from '../controllers/chat'

type ConnectionStatus =
	| 'disconnected'
	| 'connecting'
	| 'authenticating'
	| 'connected'

type IChatContext = {
	io: SocketIOClient.Socket
	characterId: string
	connectionStatus: ConnectionStatus
	connectAs: (characterId: string) => Promise<void>
	disconnect: () => void
}

const ChatContext = React.createContext({} as IChatContext)

export const useChatContext = () => React.useContext(ChatContext)

export const ChatClientContextProvider: React.FC = ({ children }) => {
	const [characterId, setCharacterId] = useState('')

	const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(
		'disconnected'
	)

	const connectAs = async (characterId: string) => {
		return new Promise<void>((resolve, reject) => {
			setConnectionStatus('connecting')
			io.open()

			io.on('disconnect', () => {
				setConnectionStatus('disconnected')
			})

			io.on('connect', async () => {
				setConnectionStatus('authenticating')
				const res = await apiCall<{ token: string }>(
					`/auth/token/${characterId}`
				)

				if (!res.ok) {
					disconnect()
					return resolve()
				}

				const token = res.body.token
				io.emit('to-server-handshake', { token })

				io.on('to-client-handshake', () => {
					if (!characterId && connectionStatus !== 'connected')
						setCharacterId(characterId)
					setConnectionStatus('connected')
					initIo()
					resolve()
				})
			})
		})
	}

	const disconnect = () => {
		io.disconnect()
	}

	return (
		<ChatContext.Provider
			value={{ io, characterId, connectionStatus, connectAs, disconnect }}
		>
			{children}
		</ChatContext.Provider>
	)
}
