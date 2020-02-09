import { getStorage } from './LocalStorageController'
import { Toaster } from '@blueprintjs/core'
import { toast } from './ToasterController'

export const SOURCE_URL = 'http://localhost:3000/api/v1'

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

/**
 * @prop method GET / POST / PUT / DELETE
 * @default 'GET'
 * @prop useAuth whether to attempt to include auth header
 * @default true
 * @prop body body object
 * @default {}
 */
export interface CallOpts {
	method: RequestMethod
	useAuth: boolean
	body?: { [key: string]: string }
}

/**
 *
 * @param url url that comes after `http://website/api/v1...`
 * @param opts options
 */
export const apiCall = async <T = {}>(
	url: string,
	opts?: Partial<CallOpts>
) => {
	const options: CallOpts = {
		method: 'GET',
		useAuth: true,
		body: undefined,
		...opts
	}

	const fullUrl = SOURCE_URL + url

	const headers: Record<string, string> = {
		'Content-Type': 'application/json'
	}

	if (options.useAuth) {
		const userToken = getStorage('user-token')
		if (!userToken)
			console.warn(
				`tried to make request ${fullUrl} with useAuth, ` +
					`when user-token is not in storage`
			)
		else headers['Authorization'] = 'Bearer ' + userToken
	}

	const res = await fetch(SOURCE_URL + url, {
		method: options.method,
		headers,
		body: JSON.stringify(options.body)
	})

	const body = (await res.json()) as Tapestry.Res<T>
	if (body.ok) {
		console.log(body)
	} else {
		console.error('API call error', body)
		toast.show({
			intent: 'danger',
			message: `${res.status} Error: "${body.errorMessage}"`
		})
	}
	return body
}
