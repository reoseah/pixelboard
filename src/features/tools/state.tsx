import { makePersisted } from '@solid-primitives/storage'
import { type Accessor, createContext, createSignal } from 'solid-js'

export type ToolSelectionState = {
	id: Accessor<string>
	select: (id: string) => void
	prev: () => string
}

export const createToolSelectionState = (): ToolSelectionState => {
	const [id, setId] = makePersisted(createSignal<string>('select'), { name: 'selected-tool' })
	let prev = 'select'

	const select = (next: string) => {
		const current = id()
		if (next === current) {
			return
		}
		prev = current
		setId(next)
	}

	return {
		id,
		select,
		prev: () => prev,
	}
}

export const ToolSelectionContext = createContext<ToolSelectionState>(createToolSelectionState())
