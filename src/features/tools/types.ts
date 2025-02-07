import type { Component, JSX, VoidComponent } from 'solid-js'

export type Tool = {
	icon: Component<Partial<JSX.SvgSVGAttributes<SVGSVGElement>>>

	onSelected?: () => void

	handleMouseDown?: (e: MouseEvent) => void
	handleMouseMove?: (e: MouseEvent) => void
	handleMouseUp?: (e: MouseEvent) => void
	handleKeyDown?: (e: KeyboardEvent) => void

	viewportClass?: string
	renderInViewport?: VoidComponent
}
