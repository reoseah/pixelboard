import { type Accessor, createSignal } from 'solid-js'
import type { ObjectInstance } from '../../features/objects/types'
import CanvasObjects from './objects'

export type ResizeDirection =
	| 'top-left'
	| 'top-right'
	| 'bottom-left'
	| 'bottom-right'
	| 'top'
	| 'right'
	| 'bottom'
	| 'left'

type State = {
	id: string
	original: ObjectInstance
	direction: ResizeDirection
	startX: number
	startY: number
}

type ObjectResizing = {
	state: Accessor<State | undefined>
	resizing: Accessor<boolean>

	start: (id: string, direction: ResizeDirection, x: number, y: number) => void
	clear: () => void
}

const [state, setState] = createSignal<State>()

const ObjectResizing: ObjectResizing = {
	state,
	resizing: () => {
		return state() !== undefined
	},

	start: (id, direction, x, y) => {
		setState({ id, original: CanvasObjects.instances.get(id)!, direction, startX: x, startY: y })
	},
	clear: () => {
		setState()
	},
}

export default ObjectResizing
