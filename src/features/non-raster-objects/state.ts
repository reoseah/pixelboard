import { makePersisted } from '@solid-primitives/storage'
import { type Accessor, type Context, createContext, createSignal } from 'solid-js'
import type * as Y from 'yjs'
import { SliceHandler } from './slice'
import type { NonRasterHandler, NonRasterInstance } from './types'

export const DefaultNonRasterHandlers = {
	slice: SliceHandler,
}

export const NonRasterHandlerRegistry = createContext<Record<string, NonRasterHandler>>(DefaultNonRasterHandlers)

export type NonRasterState = {
	elements: Y.Map<NonRasterInstance>

	selected: Accessor<string[]>
	select: (ids: string[]) => void

	highlighted: Accessor<string[]>
	highlight: (ids: string[]) => void
}

export const NonRasterStateContext = createContext<NonRasterState>() as Context<NonRasterState>

export const createNonRasterState = (ydoc: Y.Doc): NonRasterState => {
	const elements = ydoc.getMap<NonRasterInstance>('non-raster-elements')

	// TODO: keep these in ydoc per user, synchronize with others and persist in that way?
	// remove entries when elements are removed?
	const [selected, setSelected] = makePersisted(createSignal<string[]>([]), { name: 'selected-elements' })

	const [highlighted, setHighlighted] = createSignal<string[]>([])

	return {
		elements,

		selected,
		select: setSelected,
		highlighted,
		highlight: setHighlighted,
	}
}
