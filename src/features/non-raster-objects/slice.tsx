import { useContext } from 'solid-js'
import { ViewportStateContext } from '../../state/viewport'
import { NonRasterStateContext } from './state'
import type { NonRasterHandler } from './types'

export type SliceInstance = {
	type: 'slice'
	title: null | string
	x: number
	y: number
	height: number
	width: number
}

export const SliceHandler: NonRasterHandler<SliceInstance> = {
	getBounds: (instance) => ({
		x: instance.x,
		y: instance.y,
		height: instance.height,
		width: instance.width,
	}),
	render: (props: {
		instance: SliceInstance
		key: string
	}) => {
		const { scale } = useContext(ViewportStateContext)
		const { highlighted } = useContext(NonRasterStateContext)

		return (
			<div
				class="absolute outline outline-slice data-[highlighted=true]:z-50 data-[highlighted=true]:outline-primary-500"
				style={{
					left: `${props.instance.x * scale()}px`,
					top: `${props.instance.y * scale()}px`,
					width: `${props.instance.width * scale() - 1}px`,
					height: `${props.instance.height * scale() - 1}px`,
				}}
				data-highlighted={highlighted().includes(props.key)}
			/>
		)
	},
}
