/**
 * Pauses for a certain number of milliseconds.
 * @param ms
 */
export const wait = async (ms: number): Promise<void> => {
	return new Promise(resolve => {
		setTimeout(resolve, ms)
	})
}

export const resJsonOk = (): Tapestry.Res<{}> => ({
	ok: true,
	body: {}
})

export const resJson = <T>(body: T): Tapestry.Res<T> => ({
	ok: true,
	body
})

export const resJsonError = (
	code: number,
	message: string
): Tapestry.Res<{}> => ({
	ok: false,
	errorCode: code,
	errorMessage: message,
	body: {}
})

type SocketErrorMessage = {
	error: boolean
	name: string
	message: string
}

export const socketError = (
	name: string,
	message: string
): SocketErrorMessage => {
	return {
		error: true,
		name,
		message
	}
}

export const idArrayToObject = <T extends Tapestry.IDHaver>(
	arr: T[]
): { [id: string]: T } => {
	return arr.reduce((obj: { [id: string]: T }, item) => {
		obj[item.id] = item
		return obj
	}, {})
}

/** `"67469959-dc91-4aa9-8232-0a93fa223175"` -> `"room:67469959-dc91-4aa9-8232-0a93fa223175"` */
export const roomSocketName = (id: string): string => `room:${id}`

/** `"room:67469959-dc91-4aa9-8232-0a93fa223175"` -> `"67469959-dc91-4aa9-8232-0a93fa223175"` */
export const roomIdFromSocketName = (socketName: string): string => {
	if (socketName.substr(0, 5) != 'room:')
		throw new Error(`${socketName} should start with 'room:'`)
	return socketName.substr(5)
}
