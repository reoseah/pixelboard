import { makePersisted } from '@solid-primitives/storage'
import { type Accessor, createContext, createSignal } from 'solid-js'
import { createStore, produce } from 'solid-js/store'
import type * as Y from 'yjs'
import { ydoc } from '../../state/document'
import { SliceHandler, type SliceInstance } from './slice'
import type { NonRasterHandler, NonRasterInstance } from './types'

export const DefaultNonRasterHandlers = {
	slice: SliceHandler,
}

export const NonRasterHandlerRegistry = createContext<Record<string, NonRasterHandler>>(DefaultNonRasterHandlers)

export type NonRasterState = {
	elements: Y.Map<NonRasterInstance>
	store: Record<string, NonRasterInstance>

	// TODO: make this per-user, store in YDoc, synchronize and display to other users
	selected: Accessor<string[]>
	select: (ids: string[]) => void

	highlighted: Accessor<string[]>
	highlight: (ids: string[]) => void

	titleBeingEdited: Accessor<null | string>
	setTitleBeingEdited: (id: null | string) => void
}

export const createNonRasterState = (): NonRasterState => {
	const elements = ydoc.getMap<NonRasterInstance>('non-raster-elements')
	const [store, setStore] = createStore<Record<string, NonRasterInstance>>(elements.toJSON())

	const observer = (event: Y.YMapEvent<NonRasterInstance>) => {
		setStore(
			produce((store) => {
				event.changes.keys.forEach((change, key) => {
					if (change.action === 'add' || change.action === 'update') {
						store[key] = elements.get(key)!
					} else {
						delete store[key]
					}
				})
			}),
		)
	}
	elements.observe(observer)

	const [selected, setSelected] = makePersisted(createSignal<string[]>([]), { name: 'selected-elements' })
	const [highlighted, setHighlighted] = createSignal<string[]>([])
	const [titleBeingEdited, setTitleBeingEdited] = createSignal<null | string>(null)

	// FIXME: test data
	elements.set('a', {
		type: 'slice',
		x: 0,
		y: 0,
		width: 16,
		height: 16,
		title: 'Test 1',
	} satisfies SliceInstance)
	elements.set('b', {
		type: 'slice',
		x: 16,
		y: 0,
		width: 32,
		height: 32,
		title: 'Test 2',
	} satisfies SliceInstance)

	return {
		elements,
		store,

		selected,
		select: setSelected,
		highlighted,
		highlight: setHighlighted,
		titleBeingEdited,
		setTitleBeingEdited,
	}
}

export const NonRasterStateContext = createContext<NonRasterState>(createNonRasterState())
