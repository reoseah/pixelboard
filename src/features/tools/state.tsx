import { makePersisted } from '@solid-primitives/storage'
import { type Accessor, type Context, type JSX, createContext, createMemo, createSignal, useContext } from 'solid-js'
import { SelectTool } from './select'
import { SliceTool } from './slice'
import type { ActiveTool, Tool } from './types'

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

export type ActiveToolContext = {
	handler: Accessor<ActiveTool>
}

export const ActiveToolContext = createContext<ActiveToolContext>() as Context<ActiveToolContext>

export const ActiveToolProvider = (props: { children: JSX.Element }) => {
	const tools = useContext(ToolRegistry)
	const toolSelection = useContext(ToolSelectionContext)

	const handler = createMemo(() => {
		const tool = tools[toolSelection.id()]
		return tool.activate()
	})

	const activeTool = {
		handler,
	}

	return <ActiveToolContext.Provider value={activeTool}>{props.children}</ActiveToolContext.Provider>
}
