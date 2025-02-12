import { type Accessor, createSignal } from 'solid-js'
import type { ObjectInstance } from '../../features/objects/types'
import CanvasObjects from './objects'

type State = {
	ids: string[]
	originals: Record<string, ObjectInstance>
	startX: number
	startY: number
}

type ObjectMoving = {
	state: Accessor<State | undefined>
	moving: Accessor<boolean>

	start: (x: number, y: number) => void
	clear: () => void
}

const [state, setState] = createSignal<State>()

const ObjectMoving: ObjectMoving = {
	state,
	moving: () => state() !== undefined,

	start: (x, y) => {
		setState({
			ids: CanvasObjects.selection(),
			originals: Object.fromEntries(CanvasObjects.selection().map((id) => [id, CanvasObjects.instances.get(id)!])),
			startX: x,
			startY: y,
		})
	},
	clear: () => {
		setState()
	},
}

export default ObjectMoving
