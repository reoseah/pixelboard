import { Show } from 'solid-js'
import DraggedRectangle from '../state/dragged-rectangle'
import ViewportPosition from '../state/viewport-position'

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

export default SelectionBox
