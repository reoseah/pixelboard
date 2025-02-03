import { makePersisted } from '@solid-primitives/storage'
import { type Accessor, createContext, createSignal } from 'solid-js'

export type ViewportState = {
	x: Accessor<number>
	y: Accessor<number>
	scale: Accessor<number>

	move: (dx: number, dy: number) => void
	zoomIn: () => void
	zoomOut: () => void

	toCanvasX: (windowX: number) => number
	toCanvasY: (windowY: number) => number
}

const createViewportState = (): ViewportState => {
	const [x, setX] = makePersisted(createSignal(0), { name: 'canvas-x' })
	const [y, setY] = makePersisted(createSignal(0), { name: 'canvas-y' })
	const [scale, setScale] = makePersisted(createSignal(10), { name: 'canvas-scale' })

	const move = (dx: number, dy: number) => {
		setX(x() + dx)
		setY(y() + dy)
	}
	const zoomIn = () => {
		setScale(findNextZoom(scale()))
	}
	const zoomOut = () => {
		setScale(findPreviousZoom(scale()))
	}

	const toCanvasX = (windowX: number) => (windowX - window.innerWidth / 2) / scale() - x()
	const toCanvasY = (windowY: number) => (windowY - window.innerHeight / 2) / scale() - y()

	return {
		x,
		y,
		scale,

		move,
		zoomIn,
		zoomOut,

		toCanvasX,
		toCanvasY,
	}
}

export const ViewportStateContext = createContext<ViewportState>(createViewportState())

const preferredZoomLevels = [1, 2, 3, 4, 5, 7, 10, 15, 20, 25, 30, 40, 50, 75, 100, 150]

const findNextZoom = (current: number): number => {
	let nextZoom = current

	for (let i = 0; i < preferredZoomLevels.length; i++) {
		if (preferredZoomLevels[i] > current) {
			nextZoom = preferredZoomLevels[i]
			break
		}
	}

	return nextZoom
}

const findPreviousZoom = (current: number): number => {
	let nextZoom = current

	for (let i = preferredZoomLevels.length - 1; i >= 0; i--) {
		if (preferredZoomLevels[i] < current) {
			nextZoom = preferredZoomLevels[i]
			break
		}
	}

	return nextZoom
}
