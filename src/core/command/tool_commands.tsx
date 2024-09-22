import Registry from "../../state/Registry"
import { CurrentTool } from "../../state/CurrentTool"
import Command from "./command"
import { Dynamic } from "solid-js/web"

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