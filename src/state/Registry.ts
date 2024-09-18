import { createContext } from "solid-js"
import { Tool } from "../core/tools/tool"
import { createSelect } from "../core/tools/select"
import createPencil from "../core/tools/pencil"
import { CanvasActionType } from "../core/canvas_actions/canvas_action"
import { PencilStrokeType } from "../core/canvas_actions/pencil_stroke"
import createSelectRectangle from "../core/tools/select_rectangle"
import createCommandPalette from "../core/tools/command_palette"
import Command from "../core/command/command"
import { ClearProject as ClearProject } from "../core/command/virtual_canvas_commands"
import { createSelectToolCommand } from "../core/command/tool_commands"

export type Registry = {
    tools: Record<string, Tool>,
    actionTypes: Record<string, CanvasActionType>,
    commands: Record<string, Command>
}

export const Registry: Registry = {
    tools: {
        "select": createSelect(),
        "pencil": createPencil(),
        "select_rectangle": createSelectRectangle(),
        "command_palette": createCommandPalette()
    },
    actionTypes: {
        "pencil_stroke": PencilStrokeType
    },
    commands: {
        "select_tool.select": createSelectToolCommand("select"),
        "select_tool.pencil": createSelectToolCommand("pencil"),
        "select_tool.select_rectangle": createSelectToolCommand("select_rectangle"),
        "select_tool.command_palette": createSelectToolCommand("command_palette"),
        "clear_project": ClearProject,
    }
}

export const RegistryContext = createContext(Registry)