import React, { useState } from 'react'
import {
	FormGroup,
	InputGroup,
	Button,
	Card,
	Colors,
	Spinner
} from '@blueprintjs/core'
import styled, { css } from 'styled-components'

export const LoginCard = styled(Card)`
	width: 300px;
	position: relative;
	overflow: hidden;
`
const LoginForm = styled.form`
	display: flex;
	flex-direction: column;
	align-items: center;
	position: relative;

	& > * {
		margin: 10px;
	}
`

const LoginOverlay = styled.div`
	position: absolute;
	width: 100%;
	height: 100%;
	top: 0px;
	left: 0px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
`

type LoginSheetProps = {
	onSubmit: (email: string, password: string) => any
	buttonText: string
	disabled?: boolean
}

const LoginSheet: React.FC<LoginSheetProps> = ({
	onSubmit,
	buttonText,
	disabled = false
}) => {
	const itemStyle = { opacity: disabled ? '0.25' : '1.0' }

	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	return (
		<div>
			<div style={itemStyle}>
				<LoginForm
					onSubmit={e => {
						e.preventDefault()
						onSubmit(email, password)
					}}
				>
					<InputGroup
						large
						leftIcon="envelope"
						name="email"
						disabled={disabled}
						value={email}
						onChange={(e: any) => setEmail(e.target.value)}
					/>
					<InputGroup
						large
						leftIcon="lock"
						type="password"
						name="password"
						disabled={disabled}
						value={password}
						onChange={(e: any) => setPassword(e.target.value)}
					/>
					<Button type="submit" disabled={disabled}>
						{buttonText}
					</Button>
				</LoginForm>
			</div>
			{disabled ? (
				<LoginOverlay>
					<Spinner />
				</LoginOverlay>
			) : null}
		</div>
	)
}

export default LoginSheet
