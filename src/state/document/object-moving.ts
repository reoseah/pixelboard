import { type Accessor, createSignal } from 'solid-js'

type ObjectMoving = {
	moving: Accessor<boolean>
	startX: Accessor<number>
	startY: Accessor<number>
	currentX: Accessor<number>
	currentY: Accessor<number>

	start: (x: number, y: number) => void
	update: (x: number, y: number) => void
	clear: () => void
}

const [moving, setMoving] = createSignal(false)
const [startX, setStartX] = createSignal(0)
const [startY, setStartY] = createSignal(0)
const [currentX, setCurrentX] = createSignal(0)
const [currentY, setCurrentY] = createSignal(0)

const ObjectMoving: ObjectMoving = {
	moving,
	startX,
	startY,
	currentX,
	currentY,

	start: (x, y) => {
		setMoving(true)
		setStartX(x)
		setStartY(y)
		setCurrentX(x)
		setCurrentY(y)
	},
	update: (x, y) => {
		setCurrentX(x)
		setCurrentY(y)
	},
	clear: () => {
		setMoving(false)
		setStartX(0)
		setStartY(0)
		setCurrentX(0)
		setCurrentY(0)
	},
}

export default ObjectMoving
