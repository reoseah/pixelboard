import type { JSX } from 'solid-js/jsx-runtime'
import * as Y from 'yjs'
import type { SliceInstance } from '../features/non-raster-objects/slice'
import { NonRasterStateContext, createNonRasterState } from '../features/non-raster-objects/state'

export const WhiteboardStateProvider = (props: { children: JSX.Element }) => {
	const ydoc = new Y.Doc()
	const nonRasterState = createNonRasterState(ydoc)

	// FIXME: test data
	nonRasterState.elements.set('a', {
		type: 'slice',
		x: 0,
		y: 0,
		width: 16,
		height: 16,
		title: 'Test 1',
	} satisfies SliceInstance)
	nonRasterState.elements.set('b', {
		type: 'slice',
		x: 16,
		y: 0,
		width: 32,
		height: 32,
		title: 'Test 2',
	} satisfies SliceInstance)

	return <NonRasterStateContext.Provider value={nonRasterState}>{props.children}</NonRasterStateContext.Provider>
}
