import { createContext } from 'solid-js'
import { SelectTool } from './select'
import { SliceTool } from './slice'
import type { Tool } from './types'

export const DefaultTools: Record<string, Tool> = {
	select: SelectTool,
	slice: SliceTool,
}

export const ToolRegistry = createContext<Record<string, Tool>>(DefaultTools)
