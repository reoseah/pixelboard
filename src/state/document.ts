import { makePersisted } from '@solid-primitives/storage'
import { type Accessor, createContext, createSignal } from 'solid-js'
import { createStore, produce } from 'solid-js/store'
import * as Y from 'yjs'
import type { SliceInstance } from '../features/non-raster-objects/slice'
import type { NonRasterInstance } from '../features/non-raster-objects/types'

export const ydoc = new Y.Doc()

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
