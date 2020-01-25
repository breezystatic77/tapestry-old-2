import * as dotenv from 'dotenv-flow'
import { homedir } from 'os'
import * as path from 'path'

dotenv.config()

const config = {
	JWT_SECRET: process.env.JWT_SECRET,
	// PROFILES_FOLDER: process.env.PROFILES_FOLDER
	PROFILES_FOLDER: path.join(homedir() + '/tapestry_files/profiles')
}

for (let k in config) {
	if (!config[k]) throw new Error(`required env variable ${k} is not defined`)
}

export default config
