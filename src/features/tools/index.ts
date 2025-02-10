import PencilTool from './pencil'
import SelectTool from './select'
import SliceTool from './slice'
import type { Tool } from './types'

export type Tools = Record<string, Tool>

export const Tools: Tools = {
	select: SelectTool,
	slice: SliceTool,
	pencil: PencilTool,
}

export default Tools
