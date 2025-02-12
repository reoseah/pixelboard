import Slice from '../../components/Slice'
import type { ObjectHandler } from './types'

export type SliceInstance = {
	type: 'slice'
	title: null | string
	x: number
	y: number
	height: number
	width: number
}

export const SliceHandler: ObjectHandler<SliceInstance> = {
	render: Slice,

	getBounds: (instance) => ({
		x: instance.x,
		y: instance.y,
		height: instance.height,
		width: instance.width,
	}),
	move: (instance, dxDecimal, dyDecimal) => {
		const dx = Math.round(dxDecimal)
		const dy = Math.round(dyDecimal)
		return {
			...instance,
			x: instance.x + dx,
			y: instance.y + dy,
		}
	},
	resize: (instance, direction, dxDecimal, dyDecimal) => {
		const dx = Math.round(dxDecimal)
		const dy = Math.round(dyDecimal)

		let x = instance.x
		let y = instance.y
		let width = instance.width
		let height = instance.height

		if (['top', 'top-left', 'top-right'].includes(direction)) {
			y += dy
			height -= dy
		}
		if (['bottom', 'bottom-left', 'bottom-right'].includes(direction)) {
			height += dy
		}
		if (['left', 'top-left', 'bottom-left'].includes(direction)) {
			x += dx
			width -= dx
		}
		if (['right', 'top-right', 'bottom-right'].includes(direction)) {
			width += dx
		}

		if (height <= 0) {
			y += height
			height = -height
		}
		if (width <= 0) {
			x += width
			width = -width
		}

		return {
			...instance,
			x,
			y,
			width: Math.max(1, width),
			height: Math.max(1, height),
		}
	},
}
