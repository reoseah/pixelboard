import { MultiProvider } from '@solid-primitives/context'
import { makePersisted } from '@solid-primitives/storage'
import {
	type Accessor,
	type Component,
	type Context,
	createContext,
	createMemo,
	createSignal,
	For,
	onCleanup,
	useContext,
} from 'solid-js'
import * as Y from 'yjs'
import { mapYMap } from './util/mapYMap'

function App() {
	const canvasPosition = createCanvasPosition()

	const nonRasterRegistry: NonRasterRegistry = {
		slice: SliceHandler,
	}

	const ydoc = new Y.Doc()
	const nonRasterData = createNonRasterData(ydoc)

	// FIXME: test data
	nonRasterData.elements.set('a', {
		type: 'slice',
		x: 0,
		y: 0,
		width: 16,
		height: 16,
		title: 'Test 1',
	} satisfies SliceElement)
	nonRasterData.elements.set('b', {
		type: 'slice',
		x: 16,
		y: 0,
		width: 32,
		height: 32,
		title: 'Test 1',
	} satisfies SliceElement)

	return (
		<MultiProvider
			values={[
				[CanvasPositionContext, canvasPosition],
				[NonRasterRegistryContext, nonRasterRegistry],
				[NonRasterDataContext, nonRasterData],
			]}
		>
			<CanvasViewport />
		</MultiProvider>
	)
}

export type CanvasPosition = {
	x: Accessor<number>
	y: Accessor<number>
	scale: Accessor<number>

	move: (dx: number, dy: number) => void
	zoomIn: () => void
	zoomOut: () => void
}

export const CanvasPositionContext = createContext<CanvasPosition>() as Context<CanvasPosition>

export const createCanvasPosition = (): CanvasPosition => {
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

	return {
		x,
		y,
		scale,

		move,
		zoomIn,
		zoomOut,
	}
}

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

export const CanvasViewport = () => {
	const { x, y, scale, move, zoomIn, zoomOut } = useContext(CanvasPositionContext)

	const [innerWidth, setInnerWidth] = createSignal(window.innerWidth)
	const [innerHeight, setInnerHeight] = createSignal(window.innerHeight)

	const [dragging, setDragging] = createSignal(false)
	let dragTrigger: 'space' | 'wheel' | null = null

	const handleMouseDown = (e: MouseEvent) => {
		if (isEditable(e.target)) {
			return
		}
		if (e.button === 1 && dragTrigger === null) {
			setDragging(true)
			dragTrigger = 'wheel'
		}
	}
	const handleMouseMove = (e: MouseEvent) => {
		if (dragging()) {
			move(e.movementX / scale(), e.movementY / scale())
		}
	}
	const handleMouseUp = () => {
		if (dragging() && dragTrigger === 'wheel') {
			setDragging(false)
			dragTrigger = null
		}
	}

	const handleKeyDown = (e: KeyboardEvent) => {
		if (isEditable(e.target)) {
			return
		}
		if (e.key === ' ' && dragTrigger === null) {
			setDragging(true)
			dragTrigger = 'space'
		}
	}
	const handleKeyUp = (e: KeyboardEvent) => {
		if (e.key === ' ' && dragTrigger === 'space') {
			setDragging(false)
			dragTrigger = null
		}
	}

	const handleWheel = (e: WheelEvent) => {
		if (isEditable(e.target) || dragging()) {
			return
		}

		e.preventDefault()
		if (!e.ctrlKey && !e.shiftKey) {
			if (e.deltaY < 0) {
				zoomIn()
			} else {
				zoomOut()
			}
		} else if (e.shiftKey) {
			const change = e.deltaY / scale()
			if (e.ctrlKey) {
				move(0, change)
			} else {
				move(change, 0)
			}
		}
	}
	const handleResize = () => {
		setInnerWidth(window.innerWidth)
		setInnerHeight(window.innerHeight)
	}

	document.addEventListener('mousemove', handleMouseMove)
	document.addEventListener('mouseup', handleMouseUp)
	document.addEventListener('keydown', handleKeyDown)
	document.addEventListener('keyup', handleKeyUp)
	document.addEventListener('wheel', handleWheel, { passive: false })
	window.addEventListener('resize', handleResize)

	onCleanup(() => {
		document.removeEventListener('mousemove', handleMouseMove)
		document.removeEventListener('mouseup', handleMouseUp)
		document.removeEventListener('keydown', handleKeyDown)
		document.removeEventListener('keyup', handleKeyUp)
		document.removeEventListener('wheel', handleWheel)
		window.removeEventListener('resize', handleResize)
	})

	const translationX = createMemo(() => Math.round(x() * scale() + innerWidth() / 2))
	const translationY = createMemo(() => Math.round(y() * scale() + innerHeight() / 2))

	return (
		<div
			class="h-screen relative isolate overflow-hidden bg-canvas-background data-[dragging=true]:cursor-grabbing"
			data-dragging={dragging()}
			onmousedown={handleMouseDown}
		>
			<CanvasBackground width={innerWidth()} height={innerHeight()} x={translationX()} y={translationY()} />
			<div style={{ transform: `translate(${translationX()}px, ${translationY()}px)` }}>
				<NonRasterElementsRenderer />
			</div>
		</div>
	)
}

const isEditable = (target: EventTarget | null): boolean => {
	return (
		target != null &&
		((target as Element).tagName === 'INPUT' ||
			(target as Element).tagName === 'TEXTAREA' ||
			(target as HTMLElement).isContentEditable)
	)
}

const CanvasBackground = (props: {
	width: number
	height: number
	x: number
	y: number
}) => {
	const { scale } = useContext(CanvasPositionContext)

	return (
		// biome-ignore lint/a11y/noSvgWithoutTitle:
		<svg
			class="absolute pointer-events-none data-[hidden=true]:hidden"
			data-hidden={scale() < 10}
			height={props.height}
			width={props.width}
			aria-hidden
		>
			<defs>
				<pattern id="pattern-canvas-dots" height={scale()} width={scale()} patternUnits="userSpaceOnUse">
					<rect fill="var(--color-canvas-dots)" height="1" width="1" />
				</pattern>
			</defs>
			<rect
				fill="url(#pattern-canvas-dots)"
				height="100%"
				transform={`translate(${props.x % scale()} ${props.y % scale()})`}
				width="100%"
			/>
		</svg>
	)
}

export type NonRasterElement = {
	type: string
}

// biome-ignore lint/suspicious/noExplicitAny:
export type NonRasterElementHandler<T extends NonRasterElement = any> = {
	render: Component<{ element: T; key: string }>
	getBounds: (element: T) => { height: number; width: number; x: number; y: number }
}

export type NonRasterRegistry = Record<string, NonRasterElementHandler>

export const NonRasterRegistryContext = createContext<NonRasterRegistry>() as Context<NonRasterRegistry>

export type NonRasterData = {
	elements: Y.Map<NonRasterElement>
}

export const NonRasterDataContext = createContext<NonRasterData>() as Context<NonRasterData>

export const createNonRasterData = (ydoc: Y.Doc): NonRasterData => {
	const elements = ydoc.getMap<NonRasterElement>('non-raster-elements')

	return {
		elements,
	}
}

export type SliceElement = {
	type: 'slice'
	title: null | string
	x: number
	y: number
	height: number
	width: number
}

export const SliceHandler: NonRasterElementHandler<SliceElement> = {
	getBounds: (element) => ({
		height: element.height,
		width: element.width,
		x: element.x,
		y: element.y,
	}),
	render: (props: {
		element: SliceElement
		key: string
	}) => {
		const canvasPosition = useContext(CanvasPositionContext)

		return (
			<div
				class="absolute outline outline-slice"
				style={{
					left: `${props.element.x * canvasPosition.scale()}px`,
					top: `${props.element.y * canvasPosition.scale()}px`,
					width: `${props.element.width * canvasPosition.scale()}px`,
					height: `${props.element.height * canvasPosition.scale()}px`,
				}}
			/>
		)
	},
}

const NonRasterElementsRenderer = () => {
	const handlers = useContext(NonRasterRegistryContext)
	const { elements } = useContext(NonRasterDataContext)

	const rendered = mapYMap(elements, (value, key) => {
		const Renderer = handlers[value.type].render

		return <Renderer key={key} element={value} />
	})

	return <For each={Object.values(rendered)}>{(jsx) => jsx}</For>
}

export default App
