import * as SocketIO from 'socket.io'
import * as Jwt from 'jsonwebtoken'

import TapestryServer from '../TapestryServer'
import events from './events'
import { getFromJwt } from '../db/entity/Character'

import { resJsonOk, resJson, resJsonError, socketError } from '../util/utils'

const HANDSHAKE_TIMEOUT = 2.5 * 1000

export const initSockets = (server: TapestryServer) => {
	server.io = SocketIO(server.http)

	// io.use((socket, next) => {
	// 	// TODO json web token authentication
	// 	const authHeader = socket.handshake.headers['authorization']
	// 	console.log(socket.handshake)
	// 	if (!authHeader)
	// 		return next(new Error('no socket.io handshake bearer token'))
	// 	const token = (authHeader as string).split('Bearer ')[0]

	// 	console.log(token)
	// 	return next()
	// })

	// io.use((socket, next) => {
	// 	next()
	// })

	server.io.on('connection', socket => {
		const handshakeTimeout = setTimeout(() => {
			console.log(`${socket.id} timed out before handshake`)
			socket.emit(
				'to-client-error',
				socketError('handshake failed', 'handshake timed out')
			)
			socket.disconnect()
		}, HANDSHAKE_TIMEOUT)

		socket.on('to-server-handshake', async (body: { token: string }) => {
			const character = await getFromJwt(body.token)

			if (character) {
				// connectedCharacter handler only updates after a valid handshake
				server.connectedCharacters++

				socket.character = character
				character.socketId = socket.id

				clearTimeout(handshakeTimeout)
				events(server, socket)
				console.log(`connection: ${character.name}`)
				socket.emit('to-client-handshake', { success: true })
				return
			} else {
				socket.emit(
					'to-client-error',
					socketError('handshake failed', 'bad character token')
				)
				return
				// socket.disconnect()
			}
		})

		socket.on('disconnect', async () => {
			if (socket.character) {
				console.log(`disconnected: ${socket.character.name}`)
				server.connectedCharacters--
			}
		})
	})
}
