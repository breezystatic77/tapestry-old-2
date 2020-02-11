import React, { useState, useEffect } from 'react'
import { Switch } from 'react-router-dom'
import { useKey } from '../controllers/ShortcutController'
import { useChatContext } from '../hooks/ChatContext'
import { Button } from '@blueprintjs/core'
import { apiCall } from '../controllers/ApiController'
import { characterNameList } from '../utils'
import CharacterPicker from '../components/CharacterPicker'

export const Chat: React.FC = () => {
	const { io, connectAs, connectionStatus } = useChatContext()

	const [counter, setCounter] = useState(0)

	useKey('j', 'Increment Down', () => {
		setCounter(c => c - 1)
	})

	useKey('k', 'Increment Up', () => {
		setCounter(c => c + 1)
	})

	const [me, setMe] = useState<any>(null)

	useEffect(() => {
		apiCall<any>('/me').then(async res => {
			if (res.body) setMe(res.body.me)
		})
	}, [])

	return (
		<div id="chat">
			<p>Chat.</p>
			<p>Not Connected.</p>
			<h1>Counter: {counter}</h1>
			<h1>
				Connection status: <code>{connectionStatus}</code>
			</h1>
			<Button onClick={() => connectAs('grebmong')}>Connect?</Button>
			<p>me:</p>
			{me ? (
				<CharacterPicker characters={me.characters} onPick={() => {}} />
			) : null}
			<pre>{me ? JSON.stringify(me, null, 2) : ''}</pre>
		</div>
	)
}
