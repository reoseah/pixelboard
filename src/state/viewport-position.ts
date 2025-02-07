import { makePersisted } from '@solid-primitives/storage'
import { type Accessor, createSignal } from 'solid-js'

const [x, setX] = makePersisted(createSignal(0), { name: 'canvas-x' })
const [y, setY] = makePersisted(createSignal(0), { name: 'canvas-y' })
const [scale, setScale] = makePersisted(createSignal(10), { name: 'canvas-scale' })

type ViewportPosition = {
	x: Accessor<number>
	y: Accessor<number>
	scale: Accessor<number>

	move: (dx: number, dy: number) => void
	zoomIn: () => void
	zoomOut: () => void

	toCanvasX: (windowX: number) => number
	toCanvasY: (windowY: number) => number
}

const ViewportPosition: ViewportPosition = {
	x,
	y,
	scale,

	move: (dx, dy) => {
		setX(x() + dx)
		setY(y() + dy)
	},
	zoomIn: () => {
		setScale(chooseNextZoom(scale()))
	},
	zoomOut: () => {
		setScale(choosePreviousZoom(scale()))
	},

	toCanvasX: (windowX) => (windowX - window.innerWidth / 2) / scale() - x(),
	toCanvasY: (windowY) => (windowY - window.innerHeight / 2) / scale() - y(),
}

export default ViewportPosition

const preferredZoomLevels = [1, 2, 3, 4, 5, 7, 10, 15, 20, 25, 30, 40, 50, 75, 100, 150]

const chooseNextZoom = (current: number): number => {
	let zoom = current

	for (let i = 0; i < preferredZoomLevels.length; i++) {
		if (preferredZoomLevels[i] > current) {
			zoom = preferredZoomLevels[i]
			break
		}
	}

	return zoom
}

const choosePreviousZoom = (current: number): number => {
	let zoom = current

	for (let i = preferredZoomLevels.length - 1; i >= 0; i--) {
		if (preferredZoomLevels[i] < current) {
			zoom = preferredZoomLevels[i]
			break
		}
	}

	return zoom
}
