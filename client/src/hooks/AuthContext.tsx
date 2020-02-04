import React, { useState } from 'react'
import { apiCall } from '../controllers/ApiController'
import {
	setStorage,
	removeStorage
} from '../controllers/LocalStorageController'

const AuthContext: React.Context<Partial<{
	login: (email: string, password: string) => Promise<{ token: string }>
	logout: () => void
	loggedIn: boolean
}>> = React.createContext({})

export const useAuthContext = React.useContext(AuthContext)

export const AuthContextProvider: React.FC = ({ children }) => {
	const [loggedIn, setLoggedIn] = useState(false)

	return (
		<AuthContext.Provider
			value={{
				login: async (email: string, password: string) => {
					const res = await apiCall('/auth/token', {
						method: 'POST',
						useAuth: false,
						body: {
							email,
							password
						}
					})

					const body: { token: string } = await res.json()
					if (body.token) {
						setStorage({
							'user-token': body.token
						})
						setLoggedIn(true)
					}
					return body
				},
				logout: () => {
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
