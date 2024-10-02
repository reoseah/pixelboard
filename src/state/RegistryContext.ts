import { createContext, createRoot } from 'solid-js'

import CommandPalette from '../features/command_palette/CommandPaletteTool'
import { FrameType } from '../features/frame/FrameEntity'
import Frame from '../features/frame/FrameTool'
import createPencil from '../features/pencil/pencil'
import { PencilStrokeType } from '../features/pencil/pencil_stroke'
import { DeleteRectangleType } from '../features/rectangle_selection/DeleteRectangle'
import RectangleSelection from '../features/rectangle_selection/RectangleSelection'
import SelectTool from '../features/select/select'
import Collaboration from '../features/sidebar/Collaboration'
import Color from '../features/sidebar/Color'
import MainMenu from '../features/sidebar/MainMenu'
import Settings from '../features/sidebar/Settings'
import { Tab } from '../types/tab'
import { Tool } from '../types/tool'
import { CanvasActionType } from '../types/virtual_canvas'
import { EntityType } from '../types/whiteboard'

export type Registry = {
  actionTypes: Record<string, CanvasActionType>
  // moved to CommandRegistryContext to avoid circular dependencies
  // with many commands that depend on the registry
  // and randomnly break Vite's HMR
  // commands: Record<string, Command>
  elementTypes: Record<string, EntityType>
  tabs: Record<string, Tab>
  tools: Record<string, Tool>
}

export const DefaultRegistry: Registry = createRoot(() => {
  return {
    actionTypes: {
      delete_rectangle: DeleteRectangleType,
      pencil_stroke: PencilStrokeType,
    },
    elementTypes: {
      crop: FrameType,
    },
    /* eslint-disable perfectionist/sort-objects */
    tabs: {
      menu: MainMenu,
      color: Color,
      collaboration: Collaboration,
      settings: Settings,
    },
    /* eslint-disable perfectionist/sort-objects */
    tools: {
      select: SelectTool,
      pencil: createPencil(),
      select_rectangle: RectangleSelection,
      frame: Frame,
      command_palette: CommandPalette,
    },
  }
})

export const RegistryContext = createContext(DefaultRegistry)

export default RegistryContext
