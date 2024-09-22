import { createContext, createRoot } from "solid-js"

import type Tool from "../core/tools/tool"
import createSelect from "../core/tools/select"
import createPencil from "../core/tools/pencil"

import { type CanvasActionType } from "../core/canvas_actions/canvas_action"
import { PencilStrokeType } from "../core/canvas_actions/pencil_stroke"

import type Command from "../core/command/command"
import createSelectRectangle from "../core/tools/select_rectangle"
import createCommandPalette from "../core/tools/command_palette"
import { ClearProject } from "../core/command/virtual_canvas_commands"
import { createSelectToolCommand } from "../core/command/tool_commands"

import type Tab from "../core/tabs/tab"
import MainMenu from "../core/tabs/main_menu"
import Color from "../core/tabs/color"
import Settings from "../core/tabs/settings"
import { createTabCommand, ToggleSidebar } from "../core/command/sidebar_commands"
import createCrop from "../core/tools/crop"
import { DeleteSelection, Deselect, Reselect } from "../core/command/selection_commands"
import { DeleteRectangleType } from "../core/canvas_actions/delete_rectangle"

export type Registry = {
    tools: Record<string, Tool>,
    actionTypes: Record<string, CanvasActionType>,
    commands: Record<string, Command>,
    tabs: Record<string, Tab>
}

const DefaultRegistry: Registry = createRoot(() => {
    return {
        tools: {
            "select": createSelect(),
            "pencil": createPencil(),
            "crop": createCrop(),
            "select_rectangle": createSelectRectangle(),
            "command_palette": createCommandPalette()
        },
        actionTypes: {
            "pencil_stroke": PencilStrokeType,
            "delete_rectangle": DeleteRectangleType
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
            "toggle_tab.settings": createTabCommand("settings"),
            "clear_project": ClearProject,
            "deselect": Deselect,
            "reselect": Reselect,
            "delete_selection": DeleteSelection
        },
        tabs: {
            "menu": MainMenu,
            "color": Color,
            "settings": Settings
        }
    }
})

export default DefaultRegistry

export const RegistryContext = createContext(DefaultRegistry)