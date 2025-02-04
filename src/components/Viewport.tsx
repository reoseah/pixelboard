import { Entries } from '@solid-primitives/keyed'
import { createMemo, createSignal, onCleanup, useContext } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { NonRasterHandlerRegistry, NonRasterStateContext } from '../features/non-raster-objects/state'
import { ActiveToolContext } from '../features/tools/state'
import { ViewportStateContext } from '../state/viewport'

export const Viewport = () => {
	const { x, y, scale, move, zoomIn, zoomOut } = useContext(ViewportStateContext)

	const [innerWidth, setInnerWidth] = createSignal(window.innerWidth)
	const [innerHeight, setInnerHeight] = createSignal(window.innerHeight)

	const [dragging, setDragging] = createSignal(false)
	let dragTrigger: 'space' | 'wheel' | null = null

	const activeTool = useContext(ActiveToolContext)

	const handleMouseDown = (e: MouseEvent) => {
		if (isEditable(e.target)) {
			return
		}
		if (e.button === 1 && dragTrigger === null) {
			setDragging(true)
			dragTrigger = 'wheel'
		} else {
			activeTool.handler().handleMouseDown?.(e)
		}
	}
	const handleMouseMove = (e: MouseEvent) => {
		if (dragging()) {
			move(e.movementX / scale(), e.movementY / scale())
		} else {
			activeTool.handler().handleMouseMove?.(e)
		}
	}
	const handleMouseUp = (e: MouseEvent) => {
		if (dragging() && dragTrigger === 'wheel') {
			setDragging(false)
			dragTrigger = null
		} else {
			activeTool.handler().handleMouseUp?.(e)
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
			<ViewportBackground width={innerWidth()} height={innerHeight()} x={translationX()} y={translationY()} />
			<div style={{ transform: `translate(${translationX()}px, ${translationY()}px)` }}>
				<NonRasterElementsRenderer />
				{activeTool.handler()?.viewportElement}
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

const ViewportBackground = (props: {
	width: number
	height: number
	x: number
	y: number
}) => {
	const { scale } = useContext(ViewportStateContext)

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

const NonRasterElementsRenderer = () => {
	const { store, selected, highlighted } = useContext(NonRasterStateContext)
	const nonRasterHandlers = useContext(NonRasterHandlerRegistry)

	return (
		<Entries of={store}>
			{(key, instance) => {
				return (
					<Dynamic
						component={nonRasterHandlers[instance().type].render}
						key={key}
						instance={instance()}
						selected={selected().includes(key)}
						highlighted={highlighted().includes(key)}
					/>
				)
			}}
		</Entries>
	)
}
