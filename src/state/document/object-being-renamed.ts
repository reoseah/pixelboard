import { type Accessor, createSignal } from 'solid-js'

type ObjectBeingRenamed = {
	id: Accessor<null | string>
	set: (id: string) => void
	clear: () => void
}

const [id, setId] = createSignal<null | string>(null)

const ObjectBeingRenamed: ObjectBeingRenamed = {
	id,
	set: (id) => {
		setId(id)
	},
	clear: () => {
		setId(null)
	},
}

export default ObjectBeingRenamed
