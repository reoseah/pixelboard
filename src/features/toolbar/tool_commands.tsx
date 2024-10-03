import { Dynamic } from 'solid-js/web'

import CurrentTool from '../../state/CurrentTool'
import { DefaultRegistry } from '../../state/RegistryContext'
import { Command } from '../../types/commands'

export const createSelectToolCommand = (tool: string): Command => {
  return {
    execute: () => {
      CurrentTool.selectId(tool)
    },
    icon: () => <Dynamic component={DefaultRegistry.tools[tool].icon} />,
    id: `select_tool.${tool}`,
    isDisabled: () => {
      return CurrentTool.id() === tool
    },
    label: () => {
      const { tools } = DefaultRegistry
      return `Select ${tools[tool].label}`
    },
  }
}
