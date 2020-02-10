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

const LinkButton: React.FC<{ href: string; title: string; icon?: any }> = ({
	href,
	title,
	icon
}) => {
	const history = useHistory()
	return (
		<Button
			minimal
			active={history.location.pathname === href}
			onClick={() => history.push(href)}
			icon={icon}
			style={{ margin: '0px 2px' }}
		>
			{title}
		</Button>
	)
}

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
				{loggedIn ? (
					<>
						<Navbar.Divider />
						<LinkButton href="/chat" icon="chat" title="Chat" />{' '}
					</>
				) : null}
			</Navbar.Group>
			<Navbar.Group align={Alignment.RIGHT}>
				{loggedIn ? (
					<>
						<LinkButton href="/my/characters" title="Characters" />
						<LinkButton href="/my/account" title="Account" />
						<Navbar.Divider />
						<Button minimal onClick={logout}>
							Log Out
						</Button>
					</>
				) : (
					<>
						<LinkButton href="/login" title="Login" icon="log-in" />
						<LinkButton href="/register" title="Sign Up" icon="plus" />
					</>
				)}
			</Navbar.Group>
		</Navbar>
	)
}

export default SiteHeader
