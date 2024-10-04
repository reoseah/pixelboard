import type { Command } from '../../types/commands'
import type { Registry } from '../RegistryContext'
import type { SelectedTool } from '../SelectedToolContext'

const createSelectToolCommand = (selectedTool: SelectedTool, toolRegistry: Registry['tools'], tool: string): Command => {
  return {
    id: `select_tool.${tool}`,
    label: () => `Select ${toolRegistry[tool].label}`,
    icon: () => toolRegistry[tool].icon({}),
    isDisabled: () => selectedTool.id() === tool,
    execute: () => {
      selectedTool.selectId(tool)
    },
  }
}

export default createSelectToolCommand
