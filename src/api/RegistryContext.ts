import { createContext, createRoot } from "solid-js"
import { ClearProject } from "../features/canvas/virtual_canvas_commands"
import createCommandPalette from "../features/command_palette/command_palette"
import { CropType } from "../features/frame/crop"
import createCrop from "../features/frame/crop_tool"
import Collaboration from "../features/interface/sidebar/collaboration"
import Color from "../features/interface/sidebar/color"
import MainMenu from "../features/interface/sidebar/main_menu"
import Settings from "../features/interface/sidebar/settings"
import { ToggleSidebar, createTabCommand } from "../features/interface/sidebar/sidebar_commands"
import { createSelectToolCommand } from "../features/interface/toolbar/tool_commands"
import createPencil from "../features/pencil/pencil"
import { PencilStrokeType } from "../features/pencil/pencil_stroke"
import createSelect from "../features/select/select"
import { DeleteRectangleType } from "../features/select_rectangle/delete_rectangle"
import SelectRectangle from "../features/select_rectangle/select_rectangle"
import { Deselect, Reselect, DeleteSelection } from "../features/select_rectangle/selection_commands"
import { EntityType } from "./whiteboard/entity"
import { CanvasActionType } from "./canvas/canvas_action"
import Command from "./command_palette/command"
import Tab from "./sidebar/tab"
import Tool from "./tool/tool"

export type Registry = {
    tools: Record<string, Tool>,
    actionTypes: Record<string, CanvasActionType>,
    elementTypes: Record<string, EntityType>,
    commands: Record<string, Command>,
    tabs: Record<string, Tab>
}

const DefaultRegistry: Registry = createRoot(() => {
    return {
        tools: {
            "select": createSelect(),
            "pencil": createPencil(),
            "select_rectangle": SelectRectangle,
            "crop": createCrop(),
            "command_palette": createCommandPalette()
        },
        actionTypes: {
            "pencil_stroke": PencilStrokeType,
            "delete_rectangle": DeleteRectangleType
        },
        elementTypes: {
            "crop": CropType
        },
        commands: {
            "select_tool.select": createSelectToolCommand("select"),
            "select_tool.pencil": createSelectToolCommand("pencil"),
            "select_tool.crop": createSelectToolCommand("crop"),
            "select_tool.select_rectangle": createSelectToolCommand("select_rectangle"),
            "select_tool.command_palette": createSelectToolCommand("command_palette"),
            "toggle_sidebar": ToggleSidebar,
            "toggle_tab.menu": createTabCommand("menu"),
            "toggle_tab.color": createTabCommand("color"),
            "toggle_tab.collaboration": createTabCommand("collaboration"),
            "toggle_tab.settings": createTabCommand("settings"),
            "clear_project": ClearProject,
            "deselect": Deselect,
            "reselect": Reselect,
            "delete_selection": DeleteSelection
        },
        tabs: {
            "menu": MainMenu,
            "color": Color,
            "collaboration": Collaboration,
            "settings": Settings
        }
    }
})

export default DefaultRegistry

export const RegistryContext = createContext(DefaultRegistry)