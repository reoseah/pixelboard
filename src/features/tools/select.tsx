import MousePointer2Icon from 'lucide-solid/icons/mouse-pointer-2'
import { Show, createSignal, useContext } from 'solid-js'
import type * as Y from 'yjs'
import { ViewportStateContext } from '../../state/viewport'
import { NonRasterHandlerRegistry, NonRasterStateContext } from '../non-raster-objects/state'
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
		const canvasPosition = useContext(ViewportStateContext)
		const nonRasterObjectTypes = useContext(NonRasterHandlerRegistry)
		const nonRasterData = useContext(NonRasterStateContext)

		const [toolState, setToolState] = createSignal<'idle' | 'move' | 'selection_box'>('idle')

		const handleMouseDown = (e: MouseEvent) => {
			const x = canvasPosition.toCanvasX(e.clientX)
			const y = canvasPosition.toCanvasY(e.clientY)

			const key = findElementAtPos(nonRasterData.elements, nonRasterObjectTypes, x, y)
			if (key) {
			} else {
				setToolState('selection_box')
				setInitialPos({ x, y })
				setCurrentPos({ x, y })
				setDragging(true)
				nonRasterData.select([])
				nonRasterData.highlight([])
			}
		}

		const handleMouseMove = (e: MouseEvent) => {
			switch (toolState()) {
				case 'idle': {
					const canvasX = canvasPosition.toCanvasX(e.clientX)
					const canvasY = canvasPosition.toCanvasY(e.clientY)

					const key = findElementAtPos(nonRasterData.elements, nonRasterObjectTypes, canvasX, canvasY)
					if (key) {
						nonRasterData.highlight([key])
					} else {
						nonRasterData.highlight([])
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
						nonRasterObjectTypes,
						minX,
						minY,
						maxX - minX,
						maxY - minY,
					)
					nonRasterData.highlight(highlight)

					break
				}
			}
		}

		const handleMouseUp = (e: MouseEvent) => {
			setToolState('idle')
		}

		const left = () => Math.min(initialPos().x, currentPos().x)
		const top = () => Math.min(initialPos().y, currentPos().y)
		const width = () => Math.max(initialPos().x, currentPos().x) - Math.min(initialPos().x, currentPos().x)
		const height = () => Math.max(initialPos().y, currentPos().y) - Math.min(initialPos().y, currentPos().y)

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
		const bounds = handler.getBounds(element)

		if (bounds.x <= x && bounds.y <= y && x <= bounds.x + bounds.width && y <= bounds.y + bounds.height) {
			return key
		}
	}
	return null
}

export const getElementsInside = (
	elements: Y.Map<NonRasterInstance>,
	registry: Record<string, NonRasterHandler>,
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
