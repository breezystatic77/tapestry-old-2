import React, { useState } from 'react'
import { Card, Spinner, Overlay } from '@blueprintjs/core'
import LoginSheet, { LoginCard } from '../components/LoginSheet'
import styled, { css } from 'styled-components'
import CenterChildren from '../components/CenterChildren'
import { useTapestryContext } from '../App'
import { useKey } from '../controllers/ShortcutController'
import { apiCall } from '../controllers/ApiController'
import { loginAndStoreToken } from './Login'
import { setStorage } from '../controllers/LocalStorageController'

const Register: React.FC = () => {
	const { setDarkMode } = useTapestryContext()

	const [loading, setLoading] = useState(false)

	const handleSubmit = async (email: string, password: string) => {
		setLoading(true)
		try {
			await apiCall('/register', {
				method: 'POST',
				useAuth: false,
				body: {
					email,
					password
				}
			})
		} catch (err) {
			console.error(err)
		}

		try {
			console.log('logging in')
			const { token } = await loginAndStoreToken(email, password)
			setStorage({
				'user-token': token
			})
			console.log(`set token of length ${token.length}`)
		} catch (err) {
			console.error(err)
		}
		setLoading(false)
	}

	return (
		<CenterChildren>
			<LoginCard>
				<LoginSheet
					onSubmit={handleSubmit}
					buttonText="Register"
					disabled={loading}
				/>
			</LoginCard>
		</CenterChildren>
	)
}

export default Register
