import { createContext, createRoot } from 'solid-js'

import { ClearProject } from '../features/canvas/virtual_canvas_commands'
import CommandPalette from '../features/command_palette/CommandPaletteTool'
import { FrameType } from '../features/frame/FrameEntity'
import Frame from '../features/frame/FrameTool'
import { createSelectToolCommand } from '../features/interface/toolbar/tool_commands'
import createPencil from '../features/pencil/pencil'
import { PencilStrokeType } from '../features/pencil/pencil_stroke'
import createSelect from '../features/select/select'
import { DeleteRectangleType } from '../features/select_rectangle/delete_rectangle'
import SelectRectangle from '../features/select_rectangle/select_rectangle'
import { DeleteSelection, Deselect, Reselect } from '../features/select_rectangle/selection_commands'
import Collaboration from '../features/sidebar/Collaboration'
import Color from '../features/sidebar/Color'
import MainMenu from '../features/sidebar/MainMenu'
import Settings from '../features/sidebar/Settings'
import { createTabCommand, ToggleSidebar } from '../features/sidebar/sidebar_commands'
import { Command } from '../types/commands'
import { Tab } from '../types/tab'
import { Tool } from '../types/tool'
import { CanvasActionType } from '../types/virtual_canvas'
import { EntityType } from '../types/whiteboard'

export type Registry = {
  actionTypes: Record<string, CanvasActionType>
  commands: Record<string, Command>
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
    commands: {
      'clear_project': ClearProject,
      'delete_selection': DeleteSelection,
      'deselect': Deselect,
      'reselect': Reselect,
      'select_tool.command_palette': createSelectToolCommand('command_palette'),
      'select_tool.crop': createSelectToolCommand('crop'),
      'select_tool.pencil': createSelectToolCommand('pencil'),
      'select_tool.select': createSelectToolCommand('select'),
      'select_tool.select_rectangle': createSelectToolCommand('select_rectangle'),
      'toggle_sidebar': ToggleSidebar,
      'toggle_tab.collaboration': createTabCommand('collaboration'),
      'toggle_tab.color': createTabCommand('color'),
      'toggle_tab.menu': createTabCommand('menu'),
      'toggle_tab.settings': createTabCommand('settings'),
    },
    elementTypes: {
      crop: FrameType,
    },
    tabs: {
      collaboration: Collaboration,
      color: Color,
      menu: MainMenu,
      settings: Settings,
    },
    tools: {
      command_palette: CommandPalette,
      frame: Frame,
      pencil: createPencil(),
      select: createSelect(),
      select_rectangle: SelectRectangle,
    },
  }
})

export const RegistryContext = createContext(DefaultRegistry)

export default RegistryContext
