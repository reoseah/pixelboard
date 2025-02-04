import { type Accessor, createContext, createMemo, createRoot, useContext } from 'solid-js'
import { ToolRegistry, ToolSelectionContext } from '../features/tools/state'
import type { ActiveTool } from '../features/tools/types'

export const createActiveTool = () =>
	createRoot(() => {
		const tools = useContext(ToolRegistry)
		const toolSelection = useContext(ToolSelectionContext)

		const handler = createMemo(() => {
			const tool = tools[toolSelection.id()]
			return tool.activate()
		})

		return handler
	})

export const ActiveToolContext = createContext<Accessor<ActiveTool>>(createActiveTool())
