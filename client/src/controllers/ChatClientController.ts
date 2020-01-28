import React from 'react'

import * as SocketIO from 'socket.io-client'

const io = SocketIO.default()

export const ChatClientContext = React.createContext({
	io
})

export const useChatClientContext = () => React.useContext(ChatClientContext)
