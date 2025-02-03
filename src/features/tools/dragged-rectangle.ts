import { type Accessor, type Setter, createContext, createSignal } from 'solid-js'

// Shared state between a few tools (slice, rectangular selection and select when clicking and dragging on empty space)
// to allow switching the tool using keys (e.g. I, R or V) without losing the state
export type DraggedRectangle = {
	dragging: Accessor<boolean>
	setDragging: Setter<boolean>
	// Coordinates in canvas space, not window position
	initialPos: Accessor<{ x: number; y: number }>
	setInitialPos: Setter<{ x: number; y: number }>
	currentPos: Accessor<{ x: number; y: number }>
	setCurrentPos: Setter<{ x: number; y: number }>
}

export const createDraggedRectangleState = () => {
	const [dragging, setDragging] = createSignal(false)
	const [initialPos, setInitialPos] = createSignal<{ x: number; y: number }>({ x: 0, y: 0 })
	const [currentPos, setCurrentPos] = createSignal<{ x: number; y: number }>({ x: 0, y: 0 })

	// reset state on mouse up,
	document.addEventListener('mouseup', (e: MouseEvent) => {
		if (e.button !== 0) {
			return
		}
		if (!dragging()) {
			return
		}

		// delayed in case a tool registers a mouseup handler on document too
		requestAnimationFrame(() => {
			setDragging(false)
			setInitialPos({ x: 0, y: 0 })
			setCurrentPos({ x: 0, y: 0 })
		})
	})

	// TODO: export 'clear' method, call it from the component already handling mouse interactions, remove event listener?

	return {
		dragging,
		setDragging,
		initialPos,
		setInitialPos,
		currentPos,
		setCurrentPos,
	}
}

export const DraggedRectangleContext = createContext<DraggedRectangle>(createDraggedRectangleState())
