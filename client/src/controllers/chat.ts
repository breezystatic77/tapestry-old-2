import * as SocketIO from 'socket.io-client'

export const io = SocketIO.default({
	autoConnect: false
})

export const initIo = () => {}
