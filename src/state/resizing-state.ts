import { type Accessor, createSignal } from 'solid-js'

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
	id: Accessor<string | null>
	direction: Accessor<ResizeDirection>
	startX: Accessor<number>
	startY: Accessor<number>
}

const [id, setId] = createSignal<string | null>(null)
const [direction, setDirection] = createSignal<ResizeDirection>('top-left')
const [startX, setStartX] = createSignal<number>(0)
const [startY, setStartY] = createSignal<number>(0)

const ResizingState: ResizingState = {
	id,
	direction,
	startX,
	startY,
}

export default ResizingState
