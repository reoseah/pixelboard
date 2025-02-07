import { makePersisted } from '@solid-primitives/storage'
import { type Accessor, createSignal } from 'solid-js'

const [id, setId] = makePersisted(createSignal<string>('select'), { name: 'selected-tool' })
let prev = 'select'

const change = (next: string) => {
	const current = id()
	if (next === current) {
		return
	}
	prev = current
	setId(next)
}

export type SelectedTool = {
	id: Accessor<string>
	change: (id: string) => void
	prev: () => string
}

export const SelectedTool: SelectedTool = {
	id,
	change,
	prev: () => prev,
}

export default SelectedTool
