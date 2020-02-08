import React, { useState } from 'react'
import { Card, Spinner, Overlay } from '@blueprintjs/core'
import LoginSheet, { LoginCard } from '../components/LoginSheet'
import styled, { css } from 'styled-components'
import CenterChildren from '../components/CenterChildren'
import { useTapestryContext } from '../App'
import { apiCall } from '../controllers/ApiController'
import { useAuthContext } from '../hooks/AuthContext'
import { Redirect } from 'react-router-dom'

const Register: React.FC = () => {
	const { setDarkMode } = useTapestryContext()

	const [loading, setLoading] = useState(false)

	const { login, loggedIn } = useAuthContext()

	const handleSubmit = async (email: string, password: string) => {
		setLoading(true)
		try {
			const res = await apiCall('/register', {
				method: 'POST',
				useAuth: false,
				body: {
					email,
					password
				}
			})
			if (res.ok) await login(email, password)
		} catch (err) {
			console.error(err)
		}
		setLoading(false)
	}

	return (
		<CenterChildren>
			{loggedIn && !loading ? <Redirect to="/" /> : null}
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
