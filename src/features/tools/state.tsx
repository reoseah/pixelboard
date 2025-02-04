import { makePersisted } from '@solid-primitives/storage'
import { type Accessor, createContext, createSignal } from 'solid-js'
import { SelectTool } from './select'
import { SliceTool } from './slice'
import type { Tool } from './types'

export const DefaultTools: Record<string, Tool> = {
	select: SelectTool,
	slice: SliceTool,
}

export const ToolRegistry = createContext<Record<string, Tool>>(DefaultTools)

export type ToolSelectionState = {
	id: Accessor<string>
	select: (id: string) => void
	prev: () => string
}

export const createToolSelectionState = (): ToolSelectionState => {
	const [id, setId] = makePersisted(createSignal<string>('select'), { name: 'selected-tool' })
	let prev = 'select'

	const select = (next: string) => {
		const current = id()
		if (next === current) {
			return
		}
		prev = current
		setId(next)
	}

	return {
		id,
		select,
		prev: () => prev,
	}
}

export const ToolSelectionContext = createContext<ToolSelectionState>(createToolSelectionState())
