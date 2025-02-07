import { type Accessor, createEffect, onCleanup } from 'solid-js'

const useMouseUpOutside = (ref: Accessor<HTMLElement | null | undefined>, callback: (e: Event) => void) => {
	const handleClick = (event: Event) => {
		const element = ref()
		if (!element || element.contains(event.target as Node)) {
			return
		}

		callback(event)
	}
	createEffect(() => document.addEventListener('mouseup', handleClick))
	onCleanup(() => document.removeEventListener('mouseup', handleClick))
}

export default useMouseUpOutside
