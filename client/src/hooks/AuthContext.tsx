import React, { useState } from 'react'
import { apiCall } from '../controllers/ApiController'
import {
	setStorage,
	removeStorage,
	getStorage
} from '../controllers/LocalStorageController'

type IAuthContext = {
	login: (
		email: string,
		password: string
	) => Promise<Tapestry.Res<{ token: string }>>
	logout: () => Promise<void>
	loggedIn: boolean
}

const AuthContext: React.Context<IAuthContext> = React.createContext(
	{} as IAuthContext
)

export const useAuthContext = () => React.useContext(AuthContext)

export const AuthContextProvider: React.FC = ({ children }) => {
	const [loggedIn, setLoggedIn] = useState(() => !!getStorage('user-token'))

	return (
		<AuthContext.Provider
			value={{
				login: async (email: string, password: string) => {
					if (!email) console.error('no email provided')
					if (!password) console.error('no password provided')

					const res: Tapestry.Res<{ token: string }> = await apiCall(
						'/auth/token',
						{
							method: 'POST',
							useAuth: false,
							body: {
								email,
								password
							}
						}
					)

					if (res.body && res.body.token) {
						setStorage({
							'user-token': res.body.token
						})
						setLoggedIn(true)
					}
					return res
				},
				logout: async () => {
					removeStorage('user-token')
					setLoggedIn(false)
				},
				loggedIn
			}}
		>
			{children}
		</AuthContext.Provider>
	)
}
