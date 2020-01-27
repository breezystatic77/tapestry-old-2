import React from 'react'
import { Switch } from 'react-router-dom'

export const ChatContext = React.createContext({
	toaster: null
})

export const useChatContext = () => React.useContext(ChatContext)

export const Chat: React.FC = () => {
	return (
		<div id="chat">
			<h1>Chat.</h1>
		</div>
	)
}
