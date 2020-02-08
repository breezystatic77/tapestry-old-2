import React from 'react'
import { Switch } from 'react-router-dom'

export const ChatContext = React.createContext({
	toaster: null
})

export const useChatContext = () => React.useContext(ChatContext)

export const Chat: React.FC<{ match: any }> = ({ match }) => {
	return (
		<div id="chat">
			<h1>Chat.</h1>
			<h1>Not Connected.</h1>
		</div>
	)
}
