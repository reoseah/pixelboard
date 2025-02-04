import MousePointer2Icon from 'lucide-solid/icons/mouse-pointer-2'
import { Show, createSignal, onCleanup, useContext } from 'solid-js'
import type * as Y from 'yjs'
import { NonRasterStateContext } from '../../state/document'
import { ViewportStateContext } from '../../state/viewport'
import { NonRasterHandlerRegistry } from '../non-raster-objects/state'
import type { NonRasterHandler, NonRasterInstance } from '../non-raster-objects/types'
import { DraggedRectangleContext } from './dragged-rectangle'
import type { Tool } from './types'

export const SelectTool: Tool = {
	icon: MousePointer2Icon,
	activate: () => {
		const {
			dragging,
			setDragging,

			initialPos,
			setInitialPos,

			currentPos,
			setCurrentPos,
		} = useContext(DraggedRectangleContext)
		const viewport = useContext(ViewportStateContext)
		const nonRasterHandlers = useContext(NonRasterHandlerRegistry)
		const nonRasterState = useContext(NonRasterStateContext)

		const [toolState, setToolState] = createSignal<'idle' | 'move' | 'selection_box'>('idle')

		const handleMouseDown = (e: MouseEvent) => {
			e.preventDefault()

			const x = viewport.toCanvasX(e.clientX)
			const y = viewport.toCanvasY(e.clientY)

			const targetedElementId = findElementAtPos(nonRasterState.elements, nonRasterHandlers, x, y)
			if (targetedElementId) {
				const modifierKey = e.ctrlKey || e.metaKey || e.shiftKey
				const selection = nonRasterState.selected()

				let nextSelection: string[] = []

				if (!modifierKey) {
					nextSelection = [targetedElementId]
				} else {
					if (selection.includes(targetedElementId)) {
						nextSelection = selection.filter((id) => id !== targetedElementId)
					} else {
						nextSelection = [...selection, targetedElementId]
					}
				}

				nonRasterState.select(nextSelection)
				if (nextSelection.includes(targetedElementId)) {
					setToolState('move')
					setInitialPos({ x, y })
					setCurrentPos({ x, y })
				}

				return
			}
			setToolState('selection_box')
			setInitialPos({ x, y })
			setCurrentPos({ x, y })
			setDragging(true)
			nonRasterState.select([])
			nonRasterState.highlight([])
		}

		const handleMouseMove = (e: MouseEvent) => {
			switch (toolState()) {
				case 'idle': {
					const canvasX = viewport.toCanvasX(e.clientX)
					const canvasY = viewport.toCanvasY(e.clientY)

					const key = findElementAtPos(nonRasterState.elements, nonRasterHandlers, canvasX, canvasY)
					if (key) {
						nonRasterState.highlight([key])
					} else {
						nonRasterState.highlight([])
					}

					break
				}
				case 'move': {
					const x = viewport.toCanvasX(e.clientX)
					const y = viewport.toCanvasY(e.clientY)
					const dx = x - currentPos().x
					const dy = y - currentPos().y
					setCurrentPos({ x, y })

					for (const id of nonRasterState.selected()) {
						const element = nonRasterState.elements.get(id)
						if (element) {
							const handler = nonRasterHandlers[element.type]
							if (handler.move) {
								const movedElement = handler.move(element, dx, dy)
								nonRasterState.elements.set(id, movedElement)
							}
						}
					}

					break
				}
				case 'selection_box': {
					const x = viewport.toCanvasX(e.clientX)
					const y = viewport.toCanvasY(e.clientY)
					setCurrentPos({ x, y })

					const minX = Math.min(initialPos().x, currentPos().x)
					const minY = Math.min(initialPos().y, currentPos().y)
					const maxX = Math.max(initialPos().x, currentPos().x)
					const maxY = Math.max(initialPos().y, currentPos().y)

					const inside = getElementsInside(nonRasterState.elements, nonRasterHandlers, minX, minY, maxX, maxY)
					nonRasterState.highlight(inside)

					break
				}
			}
		}

		const handleMouseUp = () => {
			switch (toolState()) {
				case 'move': {
					for (const id of nonRasterState.selected()) {
						const element = nonRasterState.elements.get(id)!
						const handler = nonRasterHandlers[element.type]
						if (handler.finishMove) {
							const movedElement = handler.finishMove(element)
							nonRasterState.elements.set(id, movedElement)
						}
					}
					break
				}
				case 'selection_box': {
					const minX = Math.min(initialPos().x, currentPos().x)
					const minY = Math.min(initialPos().y, currentPos().y)
					const maxX = Math.max(initialPos().x, currentPos().x)
					const maxY = Math.max(initialPos().y, currentPos().y)

					const inside = getElementsInside(nonRasterState.elements, nonRasterHandlers, minX, minY, maxX, maxY)
					nonRasterState.select(inside)
					nonRasterState.highlight([])

					break
				}
			}
			setToolState('idle')
		}

		onCleanup(() => {
			nonRasterState.highlight([])
		})

		const left = () => Math.min(initialPos().x, currentPos().x)
		const top = () => Math.min(initialPos().y, currentPos().y)
		const width = () => Math.max(initialPos().x, currentPos().x) - Math.min(initialPos().x, currentPos().x)
		const height = () => Math.max(initialPos().y, currentPos().y) - Math.min(initialPos().y, currentPos().y)

		const selectionBox = (
			<Show when={dragging()}>
				<div
					class="absolute bg-primary-500/20 outline outline-primary-500"
					style={{
						left: `${left() * viewport.scale()}px`,
						top: `${top() * viewport.scale()}px`,
						width: `${width() * viewport.scale()}px`,
						height: `${height() * viewport.scale()}px`,
					}}
				/>
			</Show>
		)

		return {
			handleMouseDown,
			handleMouseMove,
			handleMouseUp,
			viewportElement: selectionBox,
		}
	},
}

const findElementAtPos = (
	elements: Y.Map<NonRasterInstance>,
	registry: Record<string, NonRasterHandler>,
	x: number,
	y: number,
): string | null => {
	for (const [key, element] of elements) {
		const handler = registry[element.type]
		if (handler) {
			const bounds = handler.getBounds(element)

			if (bounds.x <= x && bounds.y <= y && x <= bounds.x + bounds.width && y <= bounds.y + bounds.height) {
				return key
			}
		}
	}
	return null
}

export const getElementsInside = (
	elements: Y.Map<NonRasterInstance>,
	registry: Record<string, NonRasterHandler>,
	minX: number,
	minY: number,
	maxX: number,
	maxY: number,
) => {
	const output: string[] = []
	for (const [id, element] of elements) {
		const bounds = registry[element.type].getBounds(element)
		if (bounds.x >= minX && bounds.y >= minY && bounds.x + bounds.width <= maxX && bounds.y + bounds.height <= maxY) {
			output.push(id)
		}
	}
	return output
}
