import { User, UserStatus } from '../entity/User'
import { getConnection } from 'typeorm'
import { Character } from '../entity/Character'
import { writeProfileFile } from '../../profiles/profilesController'

export const createNewCharacter = async (name: string, owner: User) => {
	const newCharacter = new Character(name, owner)

	await newCharacter.validate()

	const existingCharacter = await getConnection()
		.getRepository(Character)
		.findOne({
			name
		})

	if (existingCharacter)
		throw new Error(`Character with name ${name} already exists`)

	const ownerCharacters = await owner.characters

	if (ownerCharacters.length >= owner.characterLimit)
		throw new Error(
			`User is already at their character limit of ${owner.characterLimit}`
		)

	const res = await getConnection()
		.getRepository(Character)
		.save(newCharacter)

	await writeProfileFile(res.id)
	return res
}
