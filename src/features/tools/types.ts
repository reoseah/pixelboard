import type { Component, JSX } from 'solid-js'

export type Tool = {
	icon: Component<Partial<JSX.SvgSVGAttributes<SVGSVGElement>>>
	/** This is called inside `createMemo` and can fully use SolidJS reactivity,
	 *  the `onCleanup` callbacks will be called when switching to a different tool.
	 *
	 * The contexts like the whiteboard state have been provided at the point this is called. */
	activate: () => ActiveTool
}

export type ActiveTool = {
	handleMouseDown?: (e: MouseEvent) => void
	handleMouseMove?: (e: MouseEvent) => void
	handleMouseUp?: (e: MouseEvent) => void

	viewportElement?: JSX.Element
}
