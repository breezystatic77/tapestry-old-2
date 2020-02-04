import React from 'react'
import { Card } from '@blueprintjs/core'
import LoginSheet, { LoginCard } from '../components/LoginSheet'
import styled from 'styled-components'
import CenterChildren from '../components/CenterChildren'
import { apiCall } from '../controllers/ApiController'
import { useHistory } from 'react-router-dom'

export const loginAndStoreToken = async (email: string, password: string) => {
	const res = await apiCall('/auth/token', {
		method: 'POST',
		useAuth: false,
		body: {
			email,
			password
		}
	})

	const body: { token: string } = await res.json()
	return body
}

const Login: React.FC = () => {
	return (
		<CenterChildren>
			<LoginCard>
				<LoginSheet onSubmit={() => {}} buttonText="Log In" />
			</LoginCard>
		</CenterChildren>
	)
}

export default Login
