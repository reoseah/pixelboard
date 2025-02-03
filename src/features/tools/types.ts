import type { Component, JSX } from 'solid-js'

export type Tool = {
	icon: Component<Partial<JSX.SvgSVGAttributes<SVGSVGElement>>>
	activate: () => ActiveTool
}

export type ActiveTool = {
	handleMouseDown?: (e: MouseEvent) => void
	handleMouseMove?: (e: MouseEvent) => void
	handleMouseUp?: (e: MouseEvent) => void

	viewportElement?: JSX.Element
}
