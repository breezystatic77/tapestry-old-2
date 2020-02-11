import React from 'react'
import styled from 'styled-components'

const PickerEntryUnstyled: React.FC<{
	character: Tapestry.ApiCharacter
	className?: string
}> = ({ character, className }) => {
	return (
		<div className={className}>
			<div className="picker-img"></div>
			<div className="picker-name" style={{ color: character.color }}>
				{character.name}
			</div>
		</div>
	)
}

const PickerEntry = styled(PickerEntryUnstyled)`
	display: flex;
	flex-direction: row;

	background: cyan;

	.picker-img {
		width: 100px;
		height: 100px;
		background: red;
		border-radius: 50px;
	}

	.picker-name {
		color: red;
	}
`

const CharacterPicker: React.FC<{
	characters: { [id: string]: Tapestry.ApiCharacter }
	onPick: (character: Tapestry.ApiCharacter) => any
}> = ({ characters, onPick }) => {
	return (
		<div>
			{Object.values(characters).map(character => (
				<PickerEntry key={character.id} character={character} />
			))}
		</div>
	)
}

export default styled(CharacterPicker)`
	display: flex;
	flex-direction: column;
	background: red;
	width: 100%;
	max-width: 250px;
`
