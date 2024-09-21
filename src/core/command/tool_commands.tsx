import Registry from "../../state/Registry"
import { CurrentTool } from "../../state/CurrentTool"
import Command from "./command"

export const createSelectToolCommand = (tool: string): Command => {
    return {
        id: `select_tool.${tool}`,
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