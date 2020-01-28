import React, { useState } from 'react'
import styled from 'styled-components'
import { useHotkeys } from 'react-hotkeys-hook'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { Chat } from './chat/Chat'
import Site from './Site'
import { Colors, ContextMenu } from '@blueprintjs/core'
import { useKey, registeredKeys } from './hooks/useKey'
import ShortcutHelp from './components/ShortcutHelp'

const AppWrapper = styled.div`
	width: 100%;
	height: 100%;
	&.bp3-dark {
		background-color: ${Colors.DARK_GRAY1};
	}
`

const TapestryContext = React.createContext({
	darkMode: false,
	setDarkMode: (() => {}) as React.Dispatch<React.SetStateAction<boolean>>,
	showContextMenu: (
		e: React.MouseEvent<Element, MouseEvent>,
		menu: JSX.Element,
		onClose?: () => void
	) => {}
})

export const useTapestryContext = () => React.useContext(TapestryContext)

const App: React.FC = () => {
	const [darkMode, setDarkMode] = useState(true)

	const showContextMenu = (
		e: React.MouseEvent<Element, MouseEvent>,
		menu: JSX.Element,
		onClose?: () => void
	) => {
		e.preventDefault()
		ContextMenu.show(
			menu,
			{ left: e.clientX, top: e.clientY },
			onClose,
			darkMode
		)
	}

	return (
		<AppWrapper id="app" className={darkMode ? 'bp3-dark' : ''}>
			<TapestryContext.Provider
				value={{
					darkMode,
					setDarkMode,
					showContextMenu
				}}
			>
				<ShortcutHelp />
				<BrowserRouter>
					<Switch>
						<Route path="/chat">
							<Chat />
						</Route>
						<Route path="/">
							<Site />
						</Route>
					</Switch>
				</BrowserRouter>
			</TapestryContext.Provider>
		</AppWrapper>
	)
}

export default App
