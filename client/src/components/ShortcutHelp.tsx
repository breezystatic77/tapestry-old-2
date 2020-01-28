import React, { useState } from 'react'
import { useKey, registeredKeys } from '../hooks/useKey'
import { Overlay, Card } from '@blueprintjs/core'
import CenterChildren from './CenterChildren'
import styled from 'styled-components'
import { useTapestryContext } from '../App'

const ShortcutsCard = styled(Card)`
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 100%;
	height: 100%;
	max-width: 900px;
	max-height: 500px;

	display: flex;
	flex-direction: column;
	flex-wrap: wrap;

	font-family: ${3};
`

const Shortcut = styled.div`
	width: 30%;
	display: flex;
	align-items: center;
`

const ShortcutKeys = styled.div`
	font-size: 18pt;
	width: 30px;
	margin-right: 10px;
	text-align: right;
`

const ShortcutDesc = styled.div`
	font-size: 10pt;
	opacity: 0.75;
`

const ShortcutHelp: React.FC = () => {
	const [active, setActive] = useState(false)

	useKey('\\', 'Show Keyboard Shortcut Help', {
		up: () => setActive(false),
		down: () => setActive(true)
	})

	const { darkMode } = useTapestryContext()

	const shortcuts = Object.entries(registeredKeys)
		.sort()
		.map(([key, desc]) => (
			<Shortcut key={key}>
				<ShortcutKeys>{key}</ShortcutKeys>
				<ShortcutDesc>{desc}</ShortcutDesc>
			</Shortcut>
		))

	return (
		<Overlay
			isOpen={active}
			canEscapeKeyClose={false}
			transitionDuration={0}
			autoFocus={false}
			enforceFocus={false}
		>
			<ShortcutsCard className={darkMode ? 'bp3-dark' : ''}>
				{shortcuts}
			</ShortcutsCard>
		</Overlay>
	)
}

export default ShortcutHelp
