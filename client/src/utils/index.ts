export const characterNameList = (characters: {
	[id: string]: Tapestry.ApiCharacter
}): any => {
	return Object.fromEntries(
		Object.entries(characters).map(([key, val]) => {
			return [val.name, key]
		})
	)
}
