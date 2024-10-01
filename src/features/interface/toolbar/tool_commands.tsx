import { Dynamic } from "solid-js/web"
import { Command } from "../../../types/commands"
import { CurrentTool } from "../../../state/CurrentToolContext"
import { DefaultRegistry } from "../../../state/RegistryContext"

export const createSelectToolCommand = (tool: string): Command => {
    return {
        id: `select_tool.${tool}`,
        icon: () => <Dynamic component={DefaultRegistry.tools[tool].icon} />,
        label: () => {
            const { tools } = DefaultRegistry
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