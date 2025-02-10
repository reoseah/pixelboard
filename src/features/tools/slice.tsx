import CropIcon from 'lucide-solid/icons/crop'
import { Show, batch } from 'solid-js'
import ObjectBeingRenamed from '../../state/document/object-being-renamed'
import CanvasObjects from '../../state/document/objects'
import DraggedRectangle from '../../state/dragged-rectangle'
import SelectedTool from '../../state/selected-tool'
import ViewportPosition from '../../state/viewport-position'
import type { SliceInstance } from '../objects/slice'
import type { Tool } from './types'

const { dragging, initialPos, lastPos } = DraggedRectangle

const handleMouseDown = (e: MouseEvent) => {
	if (e.button !== 0) {
		return
	}
	const x = ViewportPosition.toCanvasX(e.clientX)
	const y = ViewportPosition.toCanvasY(e.clientY)
	DraggedRectangle.start(x, y)

	e.preventDefault()
}

const handleMouseMove = (e: MouseEvent) => {
	if (!dragging()) {
		return
	}
	const x = ViewportPosition.toCanvasX(e.clientX)
	const y = ViewportPosition.toCanvasY(e.clientY)
	DraggedRectangle.update(x, y)

	e.preventDefault()
}

const handleMouseUp = (e: MouseEvent) => {
	if (e.button !== 0) {
		return
	}
	if (!dragging()) {
		return
	}

	const x = Math.round(Math.min(initialPos().x, lastPos().x))
	const y = Math.round(Math.min(initialPos().y, lastPos().y))
	const maxX = Math.round(Math.max(initialPos().x, lastPos().x))
	const maxY = Math.round(Math.max(initialPos().y, lastPos().y))
	const width = maxX - x
	const height = maxY - y

	batch(() => {
		e.preventDefault()

		DraggedRectangle.clear()
		SelectedTool.change('select')

		if (width > 0 && height > 0) {
			const id = crypto.randomUUID()
			CanvasObjects.instances.set(id, {
				type: 'slice',
				title: null,
				x,
				y,
				width,
				height,
			} satisfies SliceInstance)
			CanvasObjects.setSelection([id])
			ObjectBeingRenamed.set(id)
		}
	})
}

const handleKeyDown = (e: KeyboardEvent) => {
	if (e.key === 'Escape') {
		DraggedRectangle.clear()
	}
}

const SlicePreview = () => {
	const { dragging, initialPos, lastPos: currentPos } = DraggedRectangle
	const left = () => Math.min(Math.round(initialPos().x), Math.round(currentPos().x))
	const top = () => Math.min(Math.round(initialPos().y), Math.round(currentPos().y))
	const width = () => Math.abs(Math.round(currentPos().x) - Math.round(initialPos().x))
	const height = () => Math.abs(Math.round(currentPos().y) - Math.round(initialPos().y))

	return (
		<Show when={dragging()}>
			<div
				class="absolute z-15 outline outline-primary-400"
				style={{
					height: `${height() * ViewportPosition.scale()}px`,
					left: `${left() * ViewportPosition.scale()}px`,
					top: `${top() * ViewportPosition.scale()}px`,
					width: `${width() * ViewportPosition.scale()}px`,
				}}
			>
				<div
					class="absolute z-15 whitespace-nowrap rounded-sm bg-primary-600 px-2 py-1 text-white text-xs"
					style={{
						left: `calc(${width() * ViewportPosition.scale()}px + .5rem)`,
						top: `calc(${height() * ViewportPosition.scale()}px + .5rem)`,
					}}
				>
					{width()} × {height()}
				</div>
			</div>
		</Show>
	)
}

const SliceTool: Tool = {
	icon: CropIcon,

	handleMouseDown,
	handleMouseMove,
	handleMouseUp,
	handleKeyDown,

	viewportClass: 'cursor-crosshair',
	renderInViewport: SlicePreview,
}

export default SliceTool
