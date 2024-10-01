import CommandIcon from '../../assets/icons/command.svg'
import { Tool } from '../../types/tool'
import CommandPalette from './CommandPalette'

const CommandPaletteTool: Tool = {
  icon: CommandIcon,
  label: 'Command Palette',
  subToolbar: CommandPalette,
}

export default CommandPaletteTool
