import { type Accessor, createSignal } from 'solid-js'

// Shared state between a few tools (slice, rectangular selection and select when clicking and dragging on empty space)
// to allow switching the tool using keys (e.g. I, R or V) without losing the state
const [dragging, setDragging] = createSignal(false)
const [initialPos, setInitialPos] = createSignal<{ x: number; y: number }>({ x: 0, y: 0 })
const [lastPos, setLastPos] = createSignal<{ x: number; y: number }>({ x: 0, y: 0 })

type DraggedRectangle = {
	dragging: Accessor<boolean>
	// Coordinates in canvas space, not window position
	initialPos: Accessor<{ x: number; y: number }>
	lastPos: Accessor<{ x: number; y: number }>

	start: (x: number, y: number) => void
	update: (x: number, y: number) => void
	clear: () => void
}

const DraggedRectangle: DraggedRectangle = {
	dragging,
	initialPos,
	lastPos,

	start: (x, y) => {
		setDragging(true)
		setInitialPos({ x, y })
		setLastPos({ x, y })
	},
	update: (x, y) => {
		setLastPos({ x, y })
	},
	clear: () => {
		setDragging(false)
		setInitialPos({ x: 0, y: 0 })
		setLastPos({ x: 0, y: 0 })
	},
}

export default DraggedRectangle
