import { createContext, createRoot } from 'solid-js'

import { ClearProject } from '../features/canvas/virtual_canvas_commands'
import createCommandPalette from '../features/command_palette/command_palette'
import { CropType } from '../features/frame/crop'
import createCrop from '../features/frame/crop_tool'
import Collaboration from '../features/interface/sidebar/collaboration'
import Color from '../features/interface/sidebar/color'
import MainMenu from '../features/interface/sidebar/main_menu'
import Settings from '../features/interface/sidebar/settings'
import { createTabCommand, ToggleSidebar } from '../features/interface/sidebar/sidebar_commands'
import { createSelectToolCommand } from '../features/interface/toolbar/tool_commands'
import createPencil from '../features/pencil/pencil'
import { PencilStrokeType } from '../features/pencil/pencil_stroke'
import createSelect from '../features/select/select'
import { DeleteRectangleType } from '../features/select_rectangle/delete_rectangle'
import SelectRectangle from '../features/select_rectangle/select_rectangle'
import { DeleteSelection, Deselect, Reselect } from '../features/select_rectangle/selection_commands'
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
      crop: CropType,
    },
    tabs: {
      collaboration: Collaboration,
      color: Color,
      menu: MainMenu,
      settings: Settings,
    },
    tools: {
      command_palette: createCommandPalette(),
      crop: createCrop(),
      pencil: createPencil(),
      select: createSelect(),
      select_rectangle: SelectRectangle,
    },
  }
})

export const RegistryContext = createContext(DefaultRegistry)

export default RegistryContext
