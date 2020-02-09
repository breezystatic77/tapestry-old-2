// import { useHotkeys } from 'react-hotkeys-hook'
import hotkeys from 'hotkeys-js'
import { useEffect } from 'react'
import { toast } from './ToasterController'

export const registeredKeys: { [keys: string]: string } = {}

export function useKey(
	keys: string,
	desc: string,
	cb: () => void | Promise<void>,
	deps?: any[]
): void

export function useKey(
	keys: string,
	desc: string,
	cb: {
		down?: () => void | Promise<void>
		up?: () => void | Promise<void>
	},
	deps?: any[]
): void

export function useKey(
	keys: string,
	desc: string,
	cb: any,
	deps?: any[]
): void {
	useEffect(() => {
		if (!!registeredKeys[keys]) {
			toast.show({
				icon: 'warning-sign',
				intent: 'warning',
				message: `Key '${keys}' already bound! Tried to bind to '${desc}', was bound to ${registeredKeys[keys]}`
			})
		}

		if (typeof cb == 'object') {
			hotkeys(keys, { keyup: !!cb.up }, (e, hke) => {
				e.preventDefault()
				if (e.type === 'keydown' && !e.repeat && cb.down) cb.down()
				if (e.type === 'keyup' && cb.up) cb.up()
			})
		} else if (typeof cb == 'function') {
			hotkeys(keys, (e, hke) => {
				e.preventDefault()
				if (!e.repeat) cb()
			})
		}

		registeredKeys[keys] = desc

		return () => {
			hotkeys.unbind(keys)
			delete registeredKeys[keys]
		}
	}, deps)
}
