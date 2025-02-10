import type { Component } from 'solid-js'
import type { ResizeDirection } from '../../state/document/resizing-state'

export type ObjectInstance = {
	type: string
}

export type ObjectHandler<T extends ObjectInstance = any> = {
	render: Component<{ instance: T; id: string; selected: boolean; highlighted: boolean }>

	getBounds: (instance: T) => { x: number; y: number; height: number; width: number }

	// TODO: handle elements being moved separately from normal ones
	move?: (instance: T, dx: number, dy: number) => T
	finishMove?: (instance: T) => T

	resize?: (instance: T, direction: ResizeDirection, dx: number, dy: number) => T
}
