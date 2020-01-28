import 'reflect-metadata'
import TapestryServer from './TapestryServer'
import './util/config'

const main = async () => {
	console.log('creating server instance...')

	const ormOptions = require('../ormconfig.json')
	const server = new TapestryServer({
		port: 8080,
		dbOptions: ormOptions
	})

	await server.listen()
	// await server.close()
}

main()
