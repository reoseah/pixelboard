import { type Accessor, createContext, createMemo, createRoot, useContext } from 'solid-js'
import { ToolRegistry } from '../features/tools/registry'
import { ToolSelectionContext } from '../features/tools/state'
import type { Tool } from '../features/tools/types'

export const createActiveTool = () =>
	createRoot(() => {
		const tools = useContext(ToolRegistry)
		const toolSelection = useContext(ToolSelectionContext)

		const handler = createMemo(() => {
			return tools[toolSelection.id()]
		})

		return handler
	})

export const ActiveToolContext = createContext<Accessor<Tool>>(createActiveTool())
