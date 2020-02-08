import React from 'react'
import { Navbar, Alignment, Menu, Button } from '@blueprintjs/core'
import { useTapestryContext } from '../App'
import { useLocation, useHistory, Link } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import { useAuthContext } from '../hooks/AuthContext'

const MagicMenu = (
	<Menu>
		<Menu.Item text="Right Click" icon="book" />
		<Menu.Item text="Works!!" icon="warning-sign" />
	</Menu>
)

const SiteHeader: React.FC = () => {
	const { showContextMenu } = useTapestryContext()

	const history = useHistory()

	const { loggedIn, logout } = useAuthContext()

	return (
		<Navbar style={{ background: 'none', border: 'none', boxShadow: 'none' }}>
			<Navbar.Group align={Alignment.LEFT}>
				<Navbar.Heading
					style={{ cursor: 'pointer' }}
					onContextMenu={e => {
						showContextMenu(e, MagicMenu)
					}}
					onClick={() => history.push('/')}
				>
					Tapestry
				</Navbar.Heading>
			</Navbar.Group>
			<Navbar.Group align={Alignment.RIGHT}>
				{loggedIn ? (
					<>
						<Button minimal onClick={() => history.push('/chat')}>
							Chat
						</Button>
						<Navbar.Divider />
						<Button minimal onClick={logout}>
							Log Out
						</Button>
					</>
				) : (
					<>
						<Button minimal icon="plus" onClick={() => history.push('/login')}>
							Login
						</Button>
						<Button
							minimal
							icon="log-in"
							onClick={() => history.push('/register')}
						>
							Sign Up
						</Button>
					</>
				)}
			</Navbar.Group>
		</Navbar>
	)
}

export default SiteHeader
