import { MultiProvider } from '@solid-primitives/context'
import { makePersisted } from '@solid-primitives/storage'
import CropIcon from 'lucide-solid/icons/crop'
import MousePointer2Icon from 'lucide-solid/icons/mouse-pointer-2'
import {
	type Accessor,
	type Component,
	type Context,
	For,
	type JSX,
	type Setter,
	Show,
	createContext,
	createMemo,
	createSignal,
	onCleanup,
	useContext,
} from 'solid-js'
import * as Y from 'yjs'
import { mapYMap } from './util/mapYMap'

function App() {
	return (
		<AppState>
			<AppDocumentState>
				<SelectedToolSetup>
					<CanvasViewport />
					<div class="pointer-events-none absolute inset-x-auto top-2 grid w-screen place-content-center gap-1 *:pointer-events-auto">
						<Toolbar />
					</div>
				</SelectedToolSetup>
			</AppDocumentState>
		</AppState>
	)
}

const AppState = (props: { children: JSX.Element }) => {
	const canvasPosition = createCanvasPosition()
	const selectedTool = createSelectedTool()

	const nonRasterRegistry: NonRasterRegistry = {
		slice: SliceHandler,
	}
	const toolRegistry: ToolRegistry = {
		select: SelectTool,
		slice: SliceTool,
	}

	const nonRasterSelection = createNonRasterSelection()
	const rectangleDrag = createRectangleDragState()

	return (
		<MultiProvider
			values={[
				[CanvasPositionContext, canvasPosition],
				[SelectedToolContext, selectedTool],
				[ToolRegistryContext, toolRegistry],
				[NonRasterRegistryContext, nonRasterRegistry],
				[RectangleDragContext, rectangleDrag],
				[NonRasterSelectionContext, nonRasterSelection],
			]}
		>
			{props.children}
		</MultiProvider>
	)
}

const AppDocumentState = (props: { children: JSX.Element }) => {
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
		title: 'Test 2',
	} satisfies SliceElement)

	return <MultiProvider values={[[NonRasterDataContext, nonRasterData]]}>{props.children}</MultiProvider>
}

const SelectedToolSetup = (props: { children: JSX.Element }) => {
	const toolRegistry = useContext(ToolRegistryContext)
	const selectedTool = useContext(SelectedToolContext)

	const handler = createMemo(() => {
		const tool = toolRegistry[selectedTool.id()]
		return tool.use()
	})
	return <ToolHandlerContext.Provider value={handler}>{props.children}</ToolHandlerContext.Provider>
}

export type CanvasPosition = {
	x: Accessor<number>
	y: Accessor<number>
	scale: Accessor<number>

	move: (dx: number, dy: number) => void
	zoomIn: () => void
	zoomOut: () => void

	toCanvasX: (clientX: number) => number
	toCanvasY: (clientY: number) => number
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

	const toCanvasX = (clientX: number) => (clientX - window.innerWidth / 2) / scale() - x()
	const toCanvasY = (clientY: number) => (clientY - window.innerHeight / 2) / scale() - y()

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

	const tool = useContext(ToolHandlerContext)

	const handleMouseDown = (e: MouseEvent) => {
		if (isEditable(e.target)) {
			return
		}
		if (e.button === 1 && dragTrigger === null) {
			setDragging(true)
			dragTrigger = 'wheel'
		} else {
			tool().handleMouseDown?.(e)
		}
	}
	const handleMouseMove = (e: MouseEvent) => {
		if (dragging()) {
			move(e.movementX / scale(), e.movementY / scale())
		} else {
			tool().handleMouseMove?.(e)
		}
	}
	const handleMouseUp = (e: MouseEvent) => {
		if (dragging() && dragTrigger === 'wheel') {
			setDragging(false)
			dragTrigger = null
		} else {
			tool().handleMouseUp?.(e)
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
			class="relative isolate h-screen overflow-hidden bg-canvas-background data-[dragging=true]:cursor-grabbing"
			data-dragging={dragging()}
			onmousedown={handleMouseDown}
		>
			<CanvasBackground width={innerWidth()} height={innerHeight()} x={translationX()} y={translationY()} />
			<div style={{ transform: `translate(${translationX()}px, ${translationY()}px)` }}>
				<NonRasterElementsRenderer />
				{tool()?.canvasElement}
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
			class="pointer-events-none absolute data-[hidden=true]:hidden"
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

export const Toolbar = () => {
	const toolRegistry = useContext(ToolRegistryContext)
	const selectedTool = useContext(SelectedToolContext)

	return (
		<div class="round flex w-fit gap-1 rounded-lg border border-neutral-750 bg-neutral-825 p-1">
			<For each={Object.entries(toolRegistry)}>
				{([id, tool]) => (
					<button
						class="grid h-9 w-9 cursor-pointer place-items-center rounded-md text-neutral-200 transition-colors hover:bg-neutral-750 hover:text-neutral-100 active:bg-neutral-700 active:text-neutral-50 aria-pressed:bg-primary-600 aria-pressed:text-neutral-50"
						type="button"
						aria-pressed={selectedTool.id() === id}
						onClick={() => selectedTool.select(id)}
					>
						<tool.icon />
					</button>
				)}
			</For>
		</div>
	)
}

export type NonRasterElement = {
	type: string
}

// biome-ignore lint/suspicious/noExplicitAny:
export type NonRasterElementHandler<T extends NonRasterElement = any> = {
	render: Component<{ element: T; key: string }>
	getBounds: (element: T) => { x: number; y: number; height: number; width: number }
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

const NonRasterElementsRenderer = () => {
	const handlers = useContext(NonRasterRegistryContext)
	const { elements } = useContext(NonRasterDataContext)

	const rendered = mapYMap(elements, (value, key) => {
		const Renderer = handlers[value.type].render

		return <Renderer key={key} element={value} />
	})

	return <For each={Object.values(rendered)}>{(jsx) => jsx}</For>
}

export type NonRasterSelection = {
	selected: Accessor<string[]>
	select: (ids: string[]) => void

	highlighted: Accessor<string[]>
	highlight: (ids: string[]) => void
}

export const NonRasterSelectionContext = createContext<NonRasterSelection>() as Context<NonRasterSelection>

export const createNonRasterSelection = () => {
	const [selected, setSelected] = makePersisted(createSignal<string[]>([]), { name: 'selected-elements' })
	const [highlighted, setHighlighted] = createSignal<string[]>([])

	return {
		selected,
		select: setSelected,
		highlighted,
		highlight: setHighlighted,
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
		x: element.x,
		y: element.y,
		height: element.height,
		width: element.width,
	}),
	render: (props: {
		element: SliceElement
		key: string
	}) => {
		const { scale } = useContext(CanvasPositionContext)
		const { highlighted } = useContext(NonRasterSelectionContext)

		return (
			<div
				class="absolute outline outline-slice data-[highlighted=true]:z-50 data-[highlighted=true]:outline-primary-500"
				style={{
					left: `${props.element.x * scale()}px`,
					top: `${props.element.y * scale()}px`,
					width: `${props.element.width * scale() - 1}px`,
					height: `${props.element.height * scale() - 1}px`,
				}}
				data-highlighted={highlighted().includes(props.key)}
			/>
		)
	},
}

export type Tool = {
	icon: Component<Partial<JSX.SvgSVGAttributes<SVGSVGElement>>>
	use: () => ToolHandler
}

export type ToolHandler = {
	handleMouseDown?: (e: MouseEvent) => void
	handleMouseMove?: (e: MouseEvent) => void
	handleMouseUp?: (e: MouseEvent) => void

	canvasElement?: JSX.Element
}

export const ToolHandlerContext = createContext<Accessor<ToolHandler>>(() => ({}))

export type ToolRegistry = Record<string, Tool>

export const ToolRegistryContext = createContext<ToolRegistry>() as Context<ToolRegistry>

export type SelectedTool = {
	id: Accessor<string>
	select: (id: string) => void
	prev: () => string
}

export const SelectedToolContext = createContext<SelectedTool>() as Context<SelectedTool>

export const createSelectedTool = (): SelectedTool => {
	const [id, setId] = makePersisted(createSignal<string>('select'), { name: 'selected-tool' })
	let prev = 'select'

	const select = (next: string) => {
		const current = id()
		if (next === current) {
			return
		}
		prev = current
		setId(next)
	}

	return {
		id,
		select,
		prev: () => prev,
	}
}

export const SelectTool: Tool = {
	icon: MousePointer2Icon,
	use: () => {
		const {
			dragging,
			setDragging,

			initialPos,
			setInitialPos,

			currentPos,
			setCurrentPos,
		} = useContext(RectangleDragContext)
		const canvasPosition = useContext(CanvasPositionContext)
		const nonRasterHandlers = useContext(NonRasterRegistryContext)
		const nonRasterSelection = useContext(NonRasterSelectionContext)
		const nonRasterData = useContext(NonRasterDataContext)

		const [toolState, setToolState] = createSignal<'idle' | 'move' | 'selection_box'>('idle')

		const handleMouseDown = (e: MouseEvent) => {
			const x = canvasPosition.toCanvasX(e.clientX)
			const y = canvasPosition.toCanvasY(e.clientY)

			const key = findElementAtPos(nonRasterData.elements, nonRasterHandlers, x, y)
			if (key) {
			} else {
				setToolState('selection_box')
				setInitialPos({ x, y })
				setCurrentPos({ x, y })
				setDragging(true)
				nonRasterSelection.select([])
				nonRasterSelection.highlight([])
			}
		}

		const handleMouseMove = (e: MouseEvent) => {
			switch (toolState()) {
				case 'idle': {
					const canvasX = canvasPosition.toCanvasX(e.clientX)
					const canvasY = canvasPosition.toCanvasY(e.clientY)

					const key = findElementAtPos(nonRasterData.elements, nonRasterHandlers, canvasX, canvasY)
					if (key) {
						nonRasterSelection.highlight([key])
					} else {
						nonRasterSelection.highlight([])
					}

					break
				}
				case 'selection_box': {
					const x = canvasPosition.toCanvasX(e.clientX)
					const y = canvasPosition.toCanvasY(e.clientY)
					setCurrentPos({ x, y })

					const minX = Math.min(initialPos().x, currentPos().x)
					const minY = Math.min(initialPos().y, currentPos().y)
					const maxX = Math.max(initialPos().x, currentPos().x)
					const maxY = Math.max(initialPos().y, currentPos().y)

					const highlight = getElementsInside(
						nonRasterData.elements,
						nonRasterHandlers,
						minX,
						minY,
						maxX - minX,
						maxY - minY,
					)
					nonRasterSelection.highlight(highlight)

					break
				}
			}
		}

		const handleMouseUp = (e: MouseEvent) => {
			setToolState('idle')
		}

		const left = () => Math.min(Math.round(initialPos().x), Math.round(currentPos().x))
		const top = () => Math.min(Math.round(initialPos().y), Math.round(currentPos().y))
		const width = () => Math.abs(Math.round(currentPos().x) - Math.round(initialPos().x))
		const height = () => Math.abs(Math.round(currentPos().y) - Math.round(initialPos().y))

		const selectionBox = (
			<Show when={dragging()}>
				<div
					class="absolute bg-primary-500/20 outline outline-primary-500"
					style={{
						left: `${left() * canvasPosition.scale()}px`,
						top: `${top() * canvasPosition.scale()}px`,
						width: `${width() * canvasPosition.scale()}px`,
						height: `${height() * canvasPosition.scale()}px`,
					}}
				/>
			</Show>
		)

		return {
			handleMouseDown,
			handleMouseMove,
			handleMouseUp,
			canvasElement: selectionBox,
		}
	},
}

const findElementAtPos = (
	elements: Y.Map<NonRasterElement>,
	registry: NonRasterRegistry,
	x: number,
	y: number,
): string | null => {
	for (const [key, element] of elements) {
		const handler = registry[element.type]
		const bounds = handler.getBounds(element)

		if (bounds.x <= x && bounds.y <= y && x <= bounds.x + bounds.width && y <= bounds.y + bounds.height) {
			return key
		}
	}
	return null
}

export const getElementsInside = (
	elements: Y.Map<NonRasterElement>,
	registry: NonRasterRegistry,
	x: number,
	y: number,
	width: number,
	height: number,
) => {
	const output: string[] = []
	for (const [id, element] of elements) {
		const bounds = registry[element.type].getBounds(element)
		if (
			bounds.x >= x &&
			bounds.y >= y &&
			bounds.x + bounds.width <= x + width &&
			bounds.y + bounds.height <= y + height
		) {
			output.push(id)
		}
	}
	return output
}

export const SliceTool: Tool = {
	icon: CropIcon,
	use: () => {
		return {}
	},
}

// Shared state between a few tools (slice, rectangular selection and select when clicking and dragging on empty space)
// to allow switching the tool using keys (i.e. I, R or V) without losing the state
export type RectangleDragState = {
	dragging: Accessor<boolean>
	setDragging: Setter<boolean>
	// Coordinates in canvas space, not the screen position
	initialPos: Accessor<{ x: number; y: number }>
	setInitialPos: Setter<{ x: number; y: number }>
	currentPos: Accessor<{ x: number; y: number }>
	setCurrentPos: Setter<{ x: number; y: number }>
}

const RectangleDragContext = createContext<RectangleDragState>()

export const createRectangleDragState = () => {
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

	return {
		dragging,
		setDragging,
		initialPos,
		setInitialPos,
		currentPos,
		setCurrentPos,
	}
}

export default App
