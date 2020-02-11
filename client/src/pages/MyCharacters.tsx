import React, { useState, FormEvent, useRef, useEffect } from 'react'
import { apiCall } from '../controllers/ApiController'
import { Button, InputGroup } from '@blueprintjs/core'
import { characterNameList } from '../utils'

const MyCharacters: React.FC = () => {
	const [name, setName] = useState('')

	const handleNameChange = (e: any) => setName(e.target.value)

	const [characters, setCharacters] = useState<any>({})

	const updateCharacters = async () => {
		const res = await apiCall<{ me: Tapestry.ApiUser }>('/me')
		setCharacters(characterNameList(res.body.me.characters))
	}

	const createCharacter = async (e: FormEvent) => {
		const res = await apiCall<Tapestry.ApiCharacter>('/character', {
			method: 'POST',
			body: {
				name
			}
		})
		return res
	}

	useEffect(() => {
		updateCharacters()
	}, [])

	return (
		<>
			<form onSubmit={createCharacter}>
				<InputGroup value={name} onChange={handleNameChange} />
				<Button type="submit">New Character</Button>
			</form>
			<div>Characters</div>
			<pre>{JSON.stringify(characters, null, 2)}</pre>
		</>
	)
}

export default MyCharacters
