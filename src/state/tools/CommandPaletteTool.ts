import type { Tool } from '../../types/tool'

import CommandIcon from '../../assets/icons/command.svg'
import CommandPalette from '../../components/app/CommandPalette'

const CommandPaletteTool: Tool = {
  icon: CommandIcon,
  label: 'Command Palette',
  subToolbar: CommandPalette,
}

export default CommandPaletteTool
