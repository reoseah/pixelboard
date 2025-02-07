import { makePersisted } from '@solid-primitives/storage'
import { type Accessor, createSignal } from 'solid-js'

const [id, setId] = makePersisted(createSignal<string>('select'), { name: 'selected-tool' })
let prev = 'select'

type SelectedTool = {
	id: Accessor<string>
	change: (id: string) => void
	prev: () => string
}
const SelectedTool: SelectedTool = {
	id,
	change: (next) => {
		const current = id()
		if (next === current) {
			return
		}
		prev = current
		setId(next)
	},
	prev: () => prev,
}

export default SelectedTool
