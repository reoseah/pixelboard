import MousePointer2Icon from 'lucide-solid/icons/mouse-pointer-2'
import { onCleanup } from 'solid-js'
import SelectionBox from '../../components/SelectionBox'
import ObjectBeingRenamed from '../../state/document/object-being-renamed'
import ObjectMoving from '../../state/document/object-moving'
import ObjectResizing, { type ResizeDirection } from '../../state/document/object-resizing'
import CanvasObjects from '../../state/document/objects'
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
			const direction = target.getAttribute('data-resize-direction') as ResizeDirection
			ObjectResizing.start(clickedId, direction, x, y)
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

	if (ObjectResizing.resizing()) {
		const { id, original, direction, startX, startY } = ObjectResizing.state()!
		const dx = x - startX
		const dy = y - startY

		const handler = ObjectHandlers[original.type]
		if (handler.resize) {
			const replacement = handler.resize(original, direction, dx, dy)
			CanvasObjects.instances.set(id, replacement)
		}
	} else if (ObjectMoving.moving()) {
		const { ids, originals, startX, startY } = ObjectMoving.state()!
		const dx = x - startX
		const dy = y - startY

		for (const id of ids) {
			const original = originals[id]

			const handler = ObjectHandlers[original.type]
			if (handler.move) {
				const replacement = handler.move(original, dx, dy)
				CanvasObjects.instances.set(id, replacement)
			}
		}
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
	if (ObjectResizing.resizing()) {
		ObjectResizing.clear()
	} else if (ObjectMoving.moving()) {
		ObjectMoving.clear()
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

const onSelected = () => {
	onCleanup(() => {
		CanvasObjects.setHighlight([])
		ObjectMoving.clear()
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
