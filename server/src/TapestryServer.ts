import 'reflect-metadata'
import * as Express from 'express'
import * as Http from 'http'
import * as SocketIO from 'socket.io'
import * as morgan from 'morgan'
import { createConnection, ConnectionOptions, getConnection } from 'typeorm'

import { initSockets } from './sockets/sockets'
import initApi from './api/api'
import { profilesRouter } from './profiles/profilesRouter'
import { createProfilesDirectory } from './profiles/profilesController'
import { Room } from './db/entity/Room'
import { Character } from './db/entity/Character'
import { User } from './db/entity/User'

type TapestryServerConfig = {
	port: number
	dbOptions?: ConnectionOptions
}

export default class TapestryServer {
	config: TapestryServerConfig

	connectedCharacters: number = 0

	openRooms: { [roomName: string]: object }

	http: Http.Server
	app: Express.Express
	io: SocketIO.Server

	/** TapestryServer singleton instance */
	static server: TapestryServer

	constructor(config: TapestryServerConfig) {
		TapestryServer.server = this // create singleton

		this.config = config

		this.app = Express()
		this.http = new Http.Server(this.app)
		initSockets(this)

		this.app.use(morgan('tiny'))

		this.app.get('/', (req, res) => {
			res.send('hi :)')
		})

		this.app.use('/api/v1', initApi(this))

		this.app.use('/profiles', profilesRouter)

		// create profiles folder
		createProfilesDirectory()
	}

	listen(): Promise<void> {
		return new Promise<void>(async (resolve, reject) => {
			console.log('creating connection to db...')
			await createConnection(this.config.dbOptions)
			console.log('connection created.')
			console.log('starting http server...')
			this.http.listen(this.config.port, () => {
				console.log('server listening on port', this.config.port)
				resolve()
			})
		})
	}

	close(): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			this.io.close()
			this.http.close(() => {
				console.log('server on port', this.config.port, 'closed.')
				getConnection()
					.close()
					.then(() => {
						console.log('closed db connection')
						resolve()
					})
			})
		})
	}
}
