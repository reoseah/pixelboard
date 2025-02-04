import type { Component } from 'solid-js'

export type NonRasterInstance = {
	type: string
}

// biome-ignore lint/suspicious/noExplicitAny:
export type NonRasterHandler<T extends NonRasterInstance = any> = {
	// TODO: fix inability to use contexts inside this
	render: Component<{ instance: T; key: string; selected: boolean; highlighted: boolean }>

	getBounds: (instance: T) => { x: number; y: number; height: number; width: number }
	// TODO: handle elements being moved separately from normal ones
	move?: (instance: T, dx: number, dy: number) => T
	finishMove?: (instance: T) => T
}
