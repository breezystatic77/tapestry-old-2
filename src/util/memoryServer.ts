import 'reflect-metadata'
import TapestryServer from '../TapestryServer'
import './config'
import { testingDbOptions } from './testUtils'

const main = async () => {
	console.log('creating server instance...')
	const server = new TapestryServer({
		port: 8080,
		dbOptions: testingDbOptions
	})

	await server.listen()
	// await server.close()
}

main()
