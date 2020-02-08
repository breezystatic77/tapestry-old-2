import React from 'react'
import { BrowserRouter, Route, Switch, match } from 'react-router-dom'
import styled from 'styled-components'
import Register from './pages/Register'
import Login from './pages/Login'
import MyAccount from './pages/MyAccount'
import MyCharacters from './pages/MyCharacters'
import Splash from './pages/Splash'
import SiteHeader from './components/SiteHeader'

const SiteCenterer = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
`

const SiteMain = styled.div`
	width: 100%;
	max-width: 900px;
	height: 100%;
	flex-grow: 1;
	/* background: pink; */
	display: flex;
	flex-direction: column;

	& > div {
		width: 100%;
	}
`

const SiteHeaderWrap = styled.div`
	flex-grow: 0;
`

const SiteContent = styled.div`
	flex-grow: 1;
	margin: 20px 0px;
`

const SiteFooter = styled.div`
	flex-grow: 0;
`

const Site: React.FC<{ match: any }> = ({ match }) => {
	return (
		<SiteCenterer>
			<SiteMain>
				<SiteHeaderWrap>
					<SiteHeader />
				</SiteHeaderWrap>
				<SiteContent>
					<Switch>
						<Route path="/register">
							<Register />
						</Route>
						<Route path="/login">
							<Login />
						</Route>
						<Route path="/my/account">
							<MyAccount />
						</Route>
						<Route path="/my/characters"></Route>
						<Route path="/c/:characterId"></Route>
						<Route path="/">
							<Splash />
						</Route>
					</Switch>
				</SiteContent>
				<SiteFooter>
					<i>footer</i>
				</SiteFooter>
			</SiteMain>
		</SiteCenterer>
	)
}

export default Site
