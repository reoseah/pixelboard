import { createContext } from "solid-js"
import { ClearProject } from "../features/canvas/virtual_canvas_commands"
import { DeleteSelection, Deselect, Reselect } from "../features/rectangle_selection/selection_commands"
import { ToggleSidebar, createTabCommand } from "../features/sidebar/sidebar_commands"
import { createSelectToolCommand } from "../features/toolbar/tool_commands"
import { Command } from "../types/commands"

export type CommandRegistry = {
    commands: Record<string, Command>
}

export const DefaultCommandRegistry: CommandRegistry = {
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
    }
}

const CommandRegistryContext = createContext(DefaultCommandRegistry)

export default CommandRegistryContext