import React from 'react'
import { Card } from '@blueprintjs/core'
import LoginSheet, { LoginCard } from '../components/LoginSheet'
import { css } from 'styled-components'
import CenterChildren from '../components/CenterChildren'
import { useTapestryContext } from '../App'
import { useKey } from '../controllers/ShortcutController'

const Register: React.FC = () => {
	const { setDarkMode } = useTapestryContext()

	useKey('N', 'Toggle Night Mode', () => setDarkMode(darkMode => !darkMode), [])
	return (
		<CenterChildren>
			<LoginCard>
				<LoginSheet onSubmit={() => {}} buttonText="Register" />
			</LoginCard>
		</CenterChildren>
	)
}

export default Register
