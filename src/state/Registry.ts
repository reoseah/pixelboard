import { createContext } from "solid-js"
import { Tool } from "../core/tools/tool"
import { createSelect } from "../core/tools/select"
import createPencil from "../core/tools/pencil"
import { CanvasActionType } from "../core/canvas_actions/canvas_action"
import { PencilStrokeType } from "../core/canvas_actions/pencil_stroke"
import createSelectRectangle from "../core/tools/select_rectangle"
import createCommandPalette from "../core/tools/command_palette"

export type Registry = {
    tools: Record<string, Tool>,
    actionTypes: Record<string, CanvasActionType>
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
    }
}

export const RegistryContext = createContext(Registry)