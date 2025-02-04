import CropIcon from 'lucide-solid/icons/crop'
import { Show, useContext } from 'solid-js'
import { NonRasterStateContext } from '../../state/document'
import { ViewportStateContext } from '../../state/viewport'
import type { SliceInstance } from '../non-raster-objects/slice'
import { DraggedRectangleContext } from './dragged-rectangle'
import { ToolSelectionContext } from './state'
import type { Tool } from './types'

export const SliceTool: Tool = {
	icon: CropIcon,
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
		const nonRasterState = useContext(NonRasterStateContext)
		const toolSelection = useContext(ToolSelectionContext)

		const handleMouseDown = (e: MouseEvent) => {
			if (e.button !== 0) {
				return
			}
			const x = viewport.toCanvasX(e.clientX)
			const y = viewport.toCanvasY(e.clientY)

			setInitialPos({ x, y })
			setCurrentPos({ x, y })
			setDragging(true)

			e.preventDefault()
		}

		const handleMouseMove = (e: MouseEvent) => {
			if (!dragging()) {
				return
			}
			const x = viewport.toCanvasX(e.clientX)
			const y = viewport.toCanvasY(e.clientY)
			setCurrentPos({ x, y })
			e.preventDefault()
		}

		const handleMouseUp = (e: MouseEvent) => {
			if (e.button !== 0) {
				return
			}
			if (!dragging()) {
				return
			}

			const x = Math.round(Math.min(initialPos().x, currentPos().x))
			const y = Math.round(Math.min(initialPos().y, currentPos().y))
			const maxX = Math.round(Math.max(initialPos().x, currentPos().x))
			const maxY = Math.round(Math.max(initialPos().y, currentPos().y))
			const width = maxX - x
			const height = maxY - y

			if (width > 0 && height > 0) {
				const id = crypto.randomUUID()
				nonRasterState.elements.set(id, {
					type: 'slice',
					title: null,
					x,
					y,
					width,
					height,
				} satisfies SliceInstance)
				nonRasterState.select([id])
			}

			setDragging(false)
			setInitialPos({ x: 0, y: 0 })
			setCurrentPos({ x: 0, y: 0 })
			toolSelection.select('select')
		}

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				setDragging(false)
				setInitialPos({ x: 0, y: 0 })
				setCurrentPos({ x: 0, y: 0 })
			}
		}

		return {
			handleMouseDown,
			handleMouseMove,
			handleMouseUp,
			handleKeyDown,

			viewportClass: 'cursor-crosshair',
			viewportElement: <SlicePreview />,
		}
	},
}

const SlicePreview = () => {
	const viewport = useContext(ViewportStateContext)

	const { dragging, initialPos, currentPos } = useContext(DraggedRectangleContext)
	const left = () => Math.min(Math.round(initialPos().x), Math.round(currentPos().x))
	const top = () => Math.min(Math.round(initialPos().y), Math.round(currentPos().y))
	const width = () => Math.abs(Math.round(currentPos().x) - Math.round(initialPos().x))
	const height = () => Math.abs(Math.round(currentPos().y) - Math.round(initialPos().y))

	return (
		<Show when={dragging()}>
			<div
				class="absolute z-15 outline outline-primary-400"
				style={{
					height: `${height() * viewport.scale()}px`,
					left: `${left() * viewport.scale()}px`,
					top: `${top() * viewport.scale()}px`,
					width: `${width() * viewport.scale()}px`,
				}}
			>
				<div
					class="absolute z-15 whitespace-nowrap rounded-sm px-2 py-1 font-xs text-white"
					style={{
						left: `calc(${width() * viewport.scale()}px + .5rem)`,
						top: `calc(${height() * viewport.scale()}px + .5rem)`,
					}}
				>
					{width()} × {height()}
				</div>
			</div>
		</Show>
	)
}
