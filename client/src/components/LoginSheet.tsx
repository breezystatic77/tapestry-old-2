import React from 'react'
import { FormGroup, InputGroup, Button, Card, Colors } from '@blueprintjs/core'
import styled, { css } from 'styled-components'

export const LoginCard = styled(Card)`
	width: 300px;
`
const LoginForm = styled.form`
	display: flex;
	flex-direction: column;
	align-items: center;

	& > * {
		margin: 10px;
	}
`

const LoginSheet: React.FC<{
	onSubmit: (e: React.FormEvent) => any
	buttonText: string
}> = props => {
	return (
		<>
			<LoginForm onSubmit={props.onSubmit}>
				<InputGroup large leftIcon="envelope" />
				<InputGroup large leftIcon="lock" type="password" />
				<Button type="submit">{props.buttonText}</Button>
			</LoginForm>
		</>
	)
}

export default LoginSheet
