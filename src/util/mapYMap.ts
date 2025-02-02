import { createRoot, onCleanup } from 'solid-js'
import type * as Y from 'yjs'

export const mapYMap = <T, U>(ymap: Y.Map<T>, mapFn: (value: T, key: string) => U) => {
	const mapped: Record<string, U> = {}
	const disposers: Record<string, () => void> = {}

	const createMapping = (value: T, key: string) => {
		createRoot((dispose) => {
			disposers[key] = dispose
			mapped[key] = mapFn(value, key)
		})
	}
	ymap.forEach(createMapping)

	const observer = (event: Y.YMapEvent<T>) => {
		event.changes.keys.forEach((change, key) => {
			if (change.action === 'add') {
				createMapping(ymap.get(key)!, key)
			} else if (change.action === 'update') {
				const disposer = disposers[key]
				if (disposer) {
					disposer()
				}
				const value = ymap.get(key)!
				createMapping(value, key)
			} else if (change.action === 'delete') {
				const disposer = disposers[key]
				if (disposer) {
					disposer()
				}
				delete disposers[key]
				delete mapped[key]
			}
		})
	}
	ymap.observe(observer)
	onCleanup(() => {
		ymap.unobserve(observer)
		for (const dispose of Object.values(disposers)) {
			dispose()
		}
	})

	return mapped
}
