import { makePersisted } from '@solid-primitives/storage'
import { type Accessor, createSignal } from 'solid-js'
import { createStore, produce } from 'solid-js/store'
import type * as Y from 'yjs'
import type { ObjectInstance } from '../../features/objects/types'
import { ydoc } from './ydoc'

const instances = ydoc.getMap<ObjectInstance>('objects')
const [store, setStore] = createStore<Record<string, ObjectInstance>>(instances.toJSON())

const [selected, setSelected] = makePersisted(createSignal<string[]>([]), { name: 'selected-elements' })
const [highlighted, setHighlighted] = createSignal<string[]>([])
const [titleBeingEdited, setTitleBeingEdited] = createSignal<null | string>(null)

export type CanvasObjects = {
	instances: Y.Map<ObjectInstance>
	store: Record<string, ObjectInstance>

	// TODO: make this per-user, store in YDoc, synchronize and display to other users
	selected: Accessor<string[]>
	select: (ids: string[]) => void

	highlighted: Accessor<string[]>
	highlight: (ids: string[]) => void

	titleBeingEdited: Accessor<null | string>
	setTitleBeingEdited: (id: null | string) => void
}

export const CanvasObjects: CanvasObjects = {
	instances,
	store,

	selected,
	select: setSelected,
	highlighted,
	highlight: setHighlighted,
	titleBeingEdited,
	setTitleBeingEdited,
}

export default CanvasObjects

const observer = (event: Y.YMapEvent<ObjectInstance>) => {
	setStore(
		produce((store) => {
			event.changes.keys.forEach((change, key) => {
				if (change.action === 'add' || change.action === 'update') {
					store[key] = instances.get(key)!
				} else {
					delete store[key]
				}
			})
		}),
	)
}
instances.observe(observer)
