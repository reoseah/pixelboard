import type { Component, JSX } from 'solid-js'

export type Tool = {
	icon: Component<Partial<JSX.SvgSVGAttributes<SVGSVGElement>>>

	handleMouseDown?: (e: MouseEvent) => void
	handleMouseMove?: (e: MouseEvent) => void
	handleMouseUp?: (e: MouseEvent) => void
	handleKeyDown?: (e: KeyboardEvent) => void

	viewportClass?: string
	viewportElement?: Component
}
