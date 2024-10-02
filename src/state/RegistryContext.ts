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
import { Command } from '../types/commands'
import { ClearProject } from '../features/canvas/virtual_canvas_commands'
import { DeleteSelection, Deselect, Reselect } from '../features/rectangle_selection/selection_commands'
import { ToggleSidebar, createTabCommand } from '../features/sidebar/sidebar_commands'
import { createSelectToolCommand } from '../features/toolbar/tool_commands'

export type Registry = {
  actionTypes: Record<string, CanvasActionType>
  elementTypes: Record<string, EntityType>
  tabs: Record<string, Tab>
  tools: Record<string, Tool>
  commands: Record<string, Command>
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
    tabs: {
      menu: MainMenu,
      color: Color,
      collaboration: Collaboration,
      settings: Settings,
    },
    tools: {
      select: SelectTool,
      pencil: createPencil(),
      select_rectangle: RectangleSelection,
      frame: Frame,
      command_palette: CommandPalette,
    },
    commands: {
      'clear_project': ClearProject,
      'delete_selection': DeleteSelection,
      'deselect': Deselect,
      'reselect': Reselect,
      'select_tool.command_palette': createSelectToolCommand('command_palette'),
      'select_tool.frame': createSelectToolCommand('frame'),
      'select_tool.pencil': createSelectToolCommand('pencil'),
      'select_tool.select': createSelectToolCommand('select'),
      'select_tool.select_rectangle': createSelectToolCommand('select_rectangle'),
      'toggle_sidebar': ToggleSidebar,
      'toggle_tab.collaboration': createTabCommand('collaboration'),
      'toggle_tab.color': createTabCommand('color'),
      'toggle_tab.menu': createTabCommand('menu'),
      'toggle_tab.settings': createTabCommand('settings'),
    },
  }
})

export const RegistryContext = createContext(DefaultRegistry)

export default RegistryContext
