import { type Accessor, createSignal } from 'solid-js'

type ObjectMoving = {
	active: Accessor<boolean>
	startX: Accessor<number>
	startY: Accessor<number>
	currentX: Accessor<number>
	currentY: Accessor<number>

	start: (x: number, y: number) => void
	update: (x: number, y: number) => void
	clear: () => void
}

const [active, setActive] = createSignal(false)
const [startX, setStartX] = createSignal(0)
const [startY, setStartY] = createSignal(0)
const [currentX, setCurrentX] = createSignal(0)
const [currentY, setCurrentY] = createSignal(0)

const ObjectMoving: ObjectMoving = {
	active,
	startX,
	startY,
	currentX,
	currentY,

	start: (x, y) => {
		setActive(true)
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
		setActive(false)
		setStartX(0)
		setStartY(0)
		setCurrentX(0)
		setCurrentY(0)
	},
}

export default ObjectMoving
