import React from 'react'
import { Card } from '@blueprintjs/core'
import LoginSheet, { LoginCard } from '../components/LoginSheet'
import styled from 'styled-components'
import CenterChildren from '../components/CenterChildren'

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
