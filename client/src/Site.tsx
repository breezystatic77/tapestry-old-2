import React from 'react'
import { BrowserRouter, Route, Switch, match } from 'react-router-dom'
import styled from 'styled-components'
import Register from './pages/Register'
import Login from './pages/Login'
import MyAccount from './pages/MyAccount'
import MyCharacters from './pages/MyCharacters'
import Splash from './pages/Splash'
import SiteHeader from './components/SiteHeader'
import ErrorPage404 from './pages/404'

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
						<Route exact path="/register" component={Register} />
						<Route exact path="/login" component={Login} />
						<Route exact path="/my/account" component={MyAccount} />
						<Route exact path="/my/characters" component={MyCharacters} />
						<Route exact path="/" component={Splash} />
						<Route component={ErrorPage404} />
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
