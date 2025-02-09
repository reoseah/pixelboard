import { type Accessor, createEffect, onCleanup } from 'solid-js'

const useMouseDownOutside = (ref: Accessor<HTMLElement | null | undefined>, callback: (e: Event) => void) => {
	const handleClick = (event: Event) => {
		const element = ref()
		if (!element || element.contains(event.target as Node)) {
			return
		}

		callback(event)
	}
	createEffect(() => document.addEventListener('mousedown', handleClick))
	onCleanup(() => document.removeEventListener('mousedown', handleClick))
}

export default useMouseDownOutside
