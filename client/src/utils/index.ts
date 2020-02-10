export const characterNameList = (user: Tapestry.ApiUser): any => {
	return Object.fromEntries(
		Object.entries(user.characters).map(([key, val]) => {
			return [val.name, key]
		})
	)
}
