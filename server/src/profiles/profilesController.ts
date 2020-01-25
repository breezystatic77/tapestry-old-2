import * as fs from 'fs'
import * as path from 'path'

import config from '../util/config'

const profileTemplate = `
<!DOCTYPE html>
<html>
	<head>
		<style>
			body {
				background: white;
			}
		</style>
	</head>
	<body>
			<p>This profile hasn't been made yet.</p>
	</body>
</html>
`

export const profileFilePath = (id: string): string => {
	return path.join(config.PROFILES_FOLDER, id + '.html')
}

export const writeProfileFile = (
	id: string,
	content: string = profileTemplate
): Promise<void> => {
	return new Promise((resolve, reject) => {
		try {
			fs.writeFile(profileFilePath(id), content, () => resolve())
		} catch (err) {
			reject(err)
		}
	})
}

export const deleteProfileFile = (id: string): Promise<void> => {
	return new Promise((resolve, reject) => {
		try {
			fs.unlink(profileFilePath(id), () => resolve())
		} catch (err) {
			reject(err)
		}
	})
}

export const createProfilesDirectory = (): Promise<void> => {
	return new Promise((resolve, reject) => {
		try {
			fs.exists(config.PROFILES_FOLDER, exists => {
				if (!exists) {
					console.log(
						`profiles directory ${config.PROFILES_FOLDER} doesn't exist. Creating...`
					)
					fs.mkdir(config.PROFILES_FOLDER, { recursive: true }, () => resolve())
				}
			})
		} catch (err) {
			reject(err)
		}
	})
}
