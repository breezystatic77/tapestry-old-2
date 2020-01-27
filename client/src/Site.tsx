import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import styled from 'styled-components'

const SiteWrapper = styled.div`
	width: 900px;
	background: pink;
`

const Site: React.FC = () => {
	return (
		<SiteWrapper>
			<Switch></Switch>
		</SiteWrapper>
	)
}
