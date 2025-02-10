import MousePointer2Icon from 'lucide-solid/icons/mouse-pointer-2'
import { Show, onCleanup } from 'solid-js'
import ObjectBeingRenamed from '../../state/document/object-being-renamed'
import ObjectMoving from '../../state/document/object-moving'
import CanvasObjects from '../../state/document/objects'
import ResizingState, { type ResizeDirection } from '../../state/document/resizing-state'
import DraggedRectangle from '../../state/dragged-rectangle'
import ViewportPosition from '../../state/viewport-position'
import ObjectHandlers from '../objects'
import type { Tool } from './types'

const handleMouseDown = (event: MouseEvent) => {
	event.preventDefault()

	const x = ViewportPosition.toCanvasX(event.clientX)
	const y = ViewportPosition.toCanvasY(event.clientY)

	const clickedId = getObjectUnderCursor(event)
	if (clickedId) {
		const target = event.target as HTMLElement
		if (target.hasAttribute('data-renamable-title') && CanvasObjects.selection().includes(clickedId)) {
			ObjectBeingRenamed.set(clickedId)
			return
		}
		if (target.hasAttribute('data-resize-handle')) {
			ResizingState.start(clickedId, target.getAttribute('data-resize-direction') as ResizeDirection, x, y)
			return
		}

		if (event.ctrlKey || event.metaKey) {
			CanvasObjects.toggleSelection([clickedId])
		} else if (event.shiftKey) {
			CanvasObjects.addToSelection([clickedId])
		} else {
			CanvasObjects.setSelection([clickedId])
		}

		ObjectMoving.start(x, y)
	} else {
		DraggedRectangle.start(x, y)
		CanvasObjects.setSelection([])
		CanvasObjects.setHighlight([])
	}
}

const handleMouseMove = (event: MouseEvent) => {
	const x = ViewportPosition.toCanvasX(event.clientX)
	const y = ViewportPosition.toCanvasY(event.clientY)

	const hoveredId = getObjectUnderCursor(event)

	if (ResizingState.resizing()) {
		ResizingState.update(x, y)
	} else if (ObjectMoving.moving()) {
		ObjectMoving.update(x, y)
	} else if (DraggedRectangle.dragging()) {
		DraggedRectangle.update(x, y)

		const minX = Math.min(DraggedRectangle.initialPos().x, DraggedRectangle.lastPos().x)
		const minY = Math.min(DraggedRectangle.initialPos().y, DraggedRectangle.lastPos().y)
		const maxX = Math.max(DraggedRectangle.initialPos().x, DraggedRectangle.lastPos().x)
		const maxY = Math.max(DraggedRectangle.initialPos().y, DraggedRectangle.lastPos().y)

		const highlightedIds = getElementsInside(minX, minY, maxX, maxY)
		CanvasObjects.setHighlight(highlightedIds)
	} else {
		if (hoveredId) {
			CanvasObjects.setHighlight([hoveredId])
		} else {
			CanvasObjects.setHighlight([])
		}
	}
}

const handleMouseUp = () => {
	if (ResizingState.resizing()) {
		ResizingState.finish()
	} else if (ObjectMoving.moving()) {
		ObjectMoving.finish()
	} else if (DraggedRectangle.dragging()) {
		const minX = Math.min(DraggedRectangle.initialPos().x, DraggedRectangle.lastPos().x)
		const minY = Math.min(DraggedRectangle.initialPos().y, DraggedRectangle.lastPos().y)
		const maxX = Math.max(DraggedRectangle.initialPos().x, DraggedRectangle.lastPos().x)
		const maxY = Math.max(DraggedRectangle.initialPos().y, DraggedRectangle.lastPos().y)

		const inside = getElementsInside(minX, minY, maxX, maxY)
		CanvasObjects.setSelection(inside)
		CanvasObjects.setHighlight([])
		DraggedRectangle.clear()
	}
}

const SelectionBox = () => {
	const { dragging, initialPos, lastPos } = DraggedRectangle
	const { scale } = ViewportPosition

	return (
		<Show when={dragging()}>
			<div
				class="absolute bg-primary-500/20 outline outline-primary-500"
				style={{
					left: `${Math.min(initialPos().x, lastPos().x) * scale()}px`,
					top: `${Math.min(initialPos().y, lastPos().y) * scale()}px`,
					width: `${(Math.max(initialPos().x, lastPos().x) - Math.min(initialPos().x, lastPos().x)) * scale()}px`,
					height: `${(Math.max(initialPos().y, lastPos().y) - Math.min(initialPos().y, lastPos().y)) * scale()}px`,
				}}
			/>
		</Show>
	)
}

const onSelected = () => {
	onCleanup(() => {
		CanvasObjects.setHighlight([])
		ObjectMoving.finish()
	})
}

const SelectTool: Tool = {
	icon: MousePointer2Icon,

	onSelected,

	handleMouseDown,
	handleMouseMove,
	handleMouseUp,

	renderInViewport: SelectionBox,
}

export default SelectTool

const getObjectUnderCursor = (event: MouseEvent): string | null => {
	if (event.target instanceof HTMLElement) {
		const id = event.target.closest('[data-object-id]')?.getAttribute('data-object-id')
		if (id) {
			return id
		}
	}
	const x = ViewportPosition.toCanvasX(event.clientX)
	const y = ViewportPosition.toCanvasY(event.clientY)

	for (const [key, element] of CanvasObjects.instances) {
		const handler = ObjectHandlers[element.type]
		if (handler) {
			const bounds = handler.getBounds(element)

			if (bounds.x <= x && bounds.y <= y && x <= bounds.x + bounds.width && y <= bounds.y + bounds.height) {
				return key
			}
		}
	}
	return null
}

export const getElementsInside = (minX: number, minY: number, maxX: number, maxY: number) => {
	const output: string[] = []
	for (const [id, element] of CanvasObjects.instances) {
		const bounds = ObjectHandlers[element.type].getBounds(element)
		if (bounds.x >= minX && bounds.y >= minY && bounds.x + bounds.width <= maxX && bounds.y + bounds.height <= maxY) {
			output.push(id)
		}
	}
	return output
}
