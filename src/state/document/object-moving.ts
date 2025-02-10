import { type Accessor, createSignal } from 'solid-js'
import ObjectHandlers from '../../features/objects'
import CanvasObjects from './objects'

type ObjectMoving = {
	moving: Accessor<boolean>
	startX: Accessor<number>
	startY: Accessor<number>
	currentX: Accessor<number>
	currentY: Accessor<number>

	start: (x: number, y: number) => void
	update: (x: number, y: number) => void
	finish: () => void
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
		const dx = x - currentX()
		const dy = y - currentY()

		setCurrentX(x)
		setCurrentY(y)

		for (const id of CanvasObjects.selection()) {
			const element = CanvasObjects.instances.get(id)
			if (element) {
				const handler = ObjectHandlers[element.type]
				if (handler.move) {
					const movedElement = handler.move(element, dx, dy)
					CanvasObjects.instances.set(id, movedElement)
				}
			}
		}
	},
	finish: () => {
		setMoving(false)
		setStartX(0)
		setStartY(0)
		setCurrentX(0)
		setCurrentY(0)

		for (const id of CanvasObjects.selection()) {
			const element = CanvasObjects.instances.get(id)
			if (element) {
				const handler = ObjectHandlers[element.type]
				if (handler.finishMove) {
					const replacement = handler.finishMove(element)
					CanvasObjects.instances.set(id, replacement)
				}
			}
		}
	},
}

export default ObjectMoving
