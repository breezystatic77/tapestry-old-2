// import './config'
import { createConnection, getConnection, ConnectionOptions } from 'typeorm'
import TapestryServer from '../TapestryServer'

let server: TapestryServer

beforeAll(async () => {
	// server = new Server({
	// 	port: 7777,
	// 	dbOptions: {
	// 		type: 'sqlite',
	// 		database: ':memory:',
	// 		dropSchema: true,
	// 		synchronize: true,
	// 		logging: false,
	// 		entities: ['src/db/entity/**/!(*.spec).ts'],
	// 		migrations: ['src/db/migration/**/!(*.spec).ts'],
	// 		subscribers: ['src/db/subscribers/**/!(*.spec).ts']
	// 	}
	// })
	// await server.listen()
})

afterEach(async () => {
	// const c = getConnection()
	// await c.synchronize(true)
})

afterAll(async () => {
	// const c = getConnection()
	// await c.close()
	// await server.close()
})
