import MousePointer2Icon from 'lucide-solid/icons/mouse-pointer-2'
import { Show, createSignal, onCleanup } from 'solid-js'
import type * as Y from 'yjs'
import CanvasObjects from '../../state/document/objects'
import DraggedRectangle from '../../state/dragged-rectangle'
import ViewportPosition from '../../state/viewport-position'
import ObjectHandlers from '../objects'
import type { ObjectInstance } from '../objects/types'
import type { Tool } from './types'

const [toolState, setToolState] = createSignal<'idle' | 'move' | 'selection_box'>('idle')

const handleMouseDown = (e: MouseEvent) => {
	e.preventDefault()

	const x = ViewportPosition.toCanvasX(e.clientX)
	const y = ViewportPosition.toCanvasY(e.clientY)

	const targetedElementId = findElementAtPos(CanvasObjects.instances, x, y)
	if (targetedElementId) {
		const modifierKey = e.ctrlKey || e.metaKey || e.shiftKey
		const selection = CanvasObjects.selected()

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

		CanvasObjects.select(nextSelection)
		if (nextSelection.includes(targetedElementId)) {
			setToolState('move')
			DraggedRectangle.start(x, y)
		}

		return
	}
	setToolState('selection_box')
	DraggedRectangle.start(x, y)
	CanvasObjects.select([])
	CanvasObjects.highlight([])
}

const handleMouseMove = (e: MouseEvent) => {
	switch (toolState()) {
		case 'idle': {
			const canvasX = ViewportPosition.toCanvasX(e.clientX)
			const canvasY = ViewportPosition.toCanvasY(e.clientY)

			const key = findElementAtPos(CanvasObjects.instances, canvasX, canvasY)
			if (key) {
				CanvasObjects.highlight([key])
			} else {
				CanvasObjects.highlight([])
			}

			break
		}
		case 'move': {
			const x = ViewportPosition.toCanvasX(e.clientX)
			const y = ViewportPosition.toCanvasY(e.clientY)
			const dx = x - DraggedRectangle.lastPos().x
			const dy = y - DraggedRectangle.lastPos().y

			DraggedRectangle.update(x, y)

			for (const id of CanvasObjects.selected()) {
				const element = CanvasObjects.instances.get(id)
				if (element) {
					const handler = ObjectHandlers[element.type]
					if (handler.move) {
						const movedElement = handler.move(element, dx, dy)
						CanvasObjects.instances.set(id, movedElement)
					}
				}
			}

			break
		}
		case 'selection_box': {
			const x = ViewportPosition.toCanvasX(e.clientX)
			const y = ViewportPosition.toCanvasY(e.clientY)

			DraggedRectangle.update(x, y)

			const minX = Math.min(DraggedRectangle.initialPos().x, DraggedRectangle.lastPos().x)
			const minY = Math.min(DraggedRectangle.initialPos().y, DraggedRectangle.lastPos().y)
			const maxX = Math.max(DraggedRectangle.initialPos().x, DraggedRectangle.lastPos().x)
			const maxY = Math.max(DraggedRectangle.initialPos().y, DraggedRectangle.lastPos().y)

			const inside = getElementsInside(CanvasObjects.instances, minX, minY, maxX, maxY)
			CanvasObjects.highlight(inside)

			break
		}
	}
}

const handleMouseUp = () => {
	switch (toolState()) {
		case 'move': {
			for (const id of CanvasObjects.selected()) {
				const element = CanvasObjects.instances.get(id)!
				const handler = ObjectHandlers[element.type]
				if (handler.finishMove) {
					const movedElement = handler.finishMove(element)
					CanvasObjects.instances.set(id, movedElement)
				}
			}
			break
		}
		case 'selection_box': {
			const minX = Math.min(DraggedRectangle.initialPos().x, DraggedRectangle.lastPos().x)
			const minY = Math.min(DraggedRectangle.initialPos().y, DraggedRectangle.lastPos().y)
			const maxX = Math.max(DraggedRectangle.initialPos().x, DraggedRectangle.lastPos().x)
			const maxY = Math.max(DraggedRectangle.initialPos().y, DraggedRectangle.lastPos().y)

			const inside = getElementsInside(CanvasObjects.instances, minX, minY, maxX, maxY)
			CanvasObjects.select(inside)
			CanvasObjects.highlight([])

			break
		}
	}
	setToolState('idle')
}

const SelectionBox = () => {
	const { initialPos, lastPos } = DraggedRectangle

	const left = () => Math.min(initialPos().x, lastPos().x)
	const top = () => Math.min(initialPos().y, lastPos().y)
	const width = () => Math.max(initialPos().x, lastPos().x) - Math.min(initialPos().x, lastPos().x)
	const height = () => Math.max(initialPos().y, lastPos().y) - Math.min(initialPos().y, lastPos().y)

	return (
		<Show when={toolState() === 'selection_box'}>
			<div
				class="absolute bg-primary-500/20 outline outline-primary-500"
				style={{
					left: `${left() * ViewportPosition.scale()}px`,
					top: `${top() * ViewportPosition.scale()}px`,
					width: `${width() * ViewportPosition.scale()}px`,
					height: `${height() * ViewportPosition.scale()}px`,
				}}
			/>
		</Show>
	)
}

const onSelected = () => {
	onCleanup(() => {
		CanvasObjects.highlight([])
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

const findElementAtPos = (elements: Y.Map<ObjectInstance>, x: number, y: number): string | null => {
	for (const [key, element] of elements) {
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

export const getElementsInside = (
	elements: Y.Map<ObjectInstance>,
	minX: number,
	minY: number,
	maxX: number,
	maxY: number,
) => {
	const output: string[] = []
	for (const [id, element] of elements) {
		const bounds = ObjectHandlers[element.type].getBounds(element)
		if (bounds.x >= minX && bounds.y >= minY && bounds.x + bounds.width <= maxX && bounds.y + bounds.height <= maxY) {
			output.push(id)
		}
	}
	return output
}
