import { createContext } from 'solid-js'

import type { Command } from '../types/commands'
import type { Tab } from '../types/tab'
import type { Tool } from '../types/tool'
import type { CanvasActionType } from '../types/virtual_canvas'
import type { WhiteboardElementType } from '../types/whiteboard'
import type { CanvasSelection } from './CanvasSelectionContext'
import type { SelectedTool } from './SelectedToolContext'
import type { SidebarState } from './SidebarContext'
import type { VirtualCanvasState } from './VirtualCanvasContext'
import type { YjsState } from './YjsContext'

import { DeleteRectangleType } from './canvas_action/DeleteRectangle'
import { PencilStrokeType } from './canvas_action/pencil_stroke'
import createClearProjectCommand from './commands/createClearProjectCommand'
import createDeleteSelectionCommand from './commands/createDeleteSelectionCommand'
import createDeselectCommand from './commands/createDeselectCommand'
import createReselectCommand from './commands/createReselectCommand'
import createSelectToolCommand from './commands/createSelectToolCommand'
import createToggleSidebarCommand from './commands/createToggleSidebarCommand'
import createToggleTabCommand from './commands/createToogleTabCommand'
import Collaboration from './tabs/Collaboration'
import Color from './tabs/Color'
import MainMenu from './tabs/MainMenu'
import Settings from './tabs/Settings'
import CommandPalette from './tools/CommandPaletteTool'
import Frame from './tools/FrameTool'
import PencilTool from './tools/PencilTool'
import RectangleSelectionTool from './tools/RectangleSelectionTool'
import SelectTool from './tools/SelectTool'
import FrameElementType from './whiteboard_elements/FrameElementType'

export type Registry = {
  actionTypes: Record<string, CanvasActionType>
  elementTypes: Record<string, WhiteboardElementType>
  tabs: Record<string, Tab>
  tools: Record<string, Tool>
  commands: Record<string, Command>
}

const RegistryContext = createContext<Registry>(undefined as unknown as Registry)

export default RegistryContext

export const createRegistry = (
  yjs: YjsState,
  selectedTool: SelectedTool,
  sidebarState: SidebarState,
  selection: CanvasSelection,
  virtualCanvas: VirtualCanvasState,
): Registry => {
  const tools = {
    select: SelectTool,
    pencil: PencilTool,
    select_rectangle: RectangleSelectionTool,
    frame: Frame,
    command_palette: CommandPalette,
  }

  const tabs = {
    menu: MainMenu,
    color: Color,
    collaboration: Collaboration,
    settings: Settings,
  }

  return {
    actionTypes: {
      pencil_stroke: PencilStrokeType,
      delete_rectangle: DeleteRectangleType,
    },
    elementTypes: {
      crop: FrameElementType,
    },
    tabs,
    tools,
    commands: {
      'clear_project': createClearProjectCommand(yjs),

      'deselect': createDeselectCommand(selection),
      'reselect': createReselectCommand(selection),
      'delete_selection': createDeleteSelectionCommand(selection, virtualCanvas),

      'select_tool.select': createSelectToolCommand(selectedTool, tools, 'select'),
      'select_tool.pencil': createSelectToolCommand(selectedTool, tools, 'pencil'),
      'select_tool.select_rectangle': createSelectToolCommand(selectedTool, tools, 'select_rectangle'),
      'select_tool.frame': createSelectToolCommand(selectedTool, tools, 'frame'),
      'select_tool.command_palette': createSelectToolCommand(selectedTool, tools, 'command_palette'),

      'toggle_sidebar': createToggleSidebarCommand(sidebarState),
      'toggle_tab.menu': createToggleTabCommand(sidebarState, tabs, 'menu'),
      'toggle_tab.color': createToggleTabCommand(sidebarState, tabs, 'color'),
      'toggle_tab.collaboration': createToggleTabCommand(sidebarState, tabs, 'collaboration'),
      'toggle_tab.settings': createToggleTabCommand(sidebarState, tabs, 'settings'),
    },
  }
}
