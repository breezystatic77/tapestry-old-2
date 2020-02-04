type StorageKey = 'dark-mode' | 'user-token'

export const getStorage = (key: StorageKey) => {
	return localStorage.getItem(key)
}

export const setStorage = (
	keys: {
		[key in StorageKey]?: string
	}
) => {
	Object.entries(keys).map(([key, val]) => {
		if (val) localStorage.setItem(key, val)
	})
}

export const removeStorage = (key: StorageKey) => {
	localStorage.removeItem(key)
}
