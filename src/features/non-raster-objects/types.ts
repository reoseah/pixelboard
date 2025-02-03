import type { Component } from 'solid-js'

export type NonRasterInstance = {
	type: string
}

// biome-ignore lint/suspicious/noExplicitAny:
export type NonRasterHandler<T extends NonRasterInstance = any> = {
	render: Component<{ instance: T; key: string }>
	getBounds: (instance: T) => { x: number; y: number; height: number; width: number }
}
