import { Registry } from "../../state/Registry"
import { SelectedTool } from "../../state/SelectedTool"
import Command from "./command"

export const createSelectToolCommand = (tool: string): Command => {
    return {
        id: `select_tool.${tool}`,
        label: () => {
            const { tools } = Registry
            return `Select ${tools[tool].label}`
        },
        isDisabled: () => {
            const [selectedTool] = SelectedTool
            return selectedTool() === tool
        },
        execute: () => {
            const [, selectTool] = SelectedTool
            selectTool(tool)
        }
    }
}