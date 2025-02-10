import { type Accessor, createSignal } from 'solid-js'
import ObjectHandlers from '../../features/objects'
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

type ResizingState = {
	resizing: Accessor<boolean>

	id: Accessor<string | null>
	direction: Accessor<ResizeDirection>
	startX: Accessor<number>
	startY: Accessor<number>

	start: (id: string, direction: ResizeDirection, x: number, y: number) => void
	update: (x: number, y: number) => void
	finish: () => void
}

const [id, setId] = createSignal<string | null>(null)
const [direction, setDirection] = createSignal<ResizeDirection>('top-left')
const [startX, setStartX] = createSignal(0)
const [startY, setStartY] = createSignal(0)
// const [currentX, setCurrentX] = createSignal(0)
// const [currentY, setCurrentY] = createSignal(0)

const ResizingState: ResizingState = {
	resizing: () => {
		return id() !== null
	},

	id,
	direction,
	startX,

	startY,

	start: (id, direction, x, y) => {
		setId(id)
		setDirection(direction)
		setStartX(x)
		setStartY(y)
	},
	update: (x, y) => {
		if (!id()) {
			return
		}
		const dx = x - startX()
		const dy = y - startY()
		// FIXME
		setStartX(x)
		setStartY(y)

		const object = CanvasObjects.instances.get(id()!)!
		const handler = ObjectHandlers[object.type]
		if (handler.resize) {
			const replacement = handler.resize(object, direction(), dx, dy)
			CanvasObjects.instances.set(id()!, replacement)
		}
	},
	finish: () => {
		setId(null)
	},
}

export default ResizingState
