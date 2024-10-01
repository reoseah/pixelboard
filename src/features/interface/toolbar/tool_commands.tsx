import { Dynamic } from "solid-js/web"
import Command from "../../../api/command_palette/command"
import { CurrentTool } from "../../../api/tool/CurrentToolContext"
import Registry from "../../../api/RegistryContext"

export const createSelectToolCommand = (tool: string): Command => {
    return {
        id: `select_tool.${tool}`,
        icon: () => <Dynamic component={Registry.tools[tool].icon} />,
        label: () => {
            const { tools } = Registry
            return `Select ${tools[tool].label}`
        },
        isDisabled: () => {
            return CurrentTool.id() === tool
        },
        execute: () => {
            CurrentTool.selectId(tool)
        }
    }
}