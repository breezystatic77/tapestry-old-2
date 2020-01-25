import 'reflect-metadata'
import TapestryServer from './TapestryServer'
import './util/config'

const main = async () => {
	console.log('creating server instance...')
	const server = new TapestryServer({
		port: 8080
	})

	await server.listen()
	// await server.close()
}

main()
