import CommandIcon from '../../assets/icons/command.svg'
import CommandPalette from '../../components/app/CommandPalette'
import { Tool } from '../../types/tool'

const CommandPaletteTool: Tool = {
  icon: CommandIcon,
  label: 'Command Palette',
  subToolbar: CommandPalette,
}

export default CommandPaletteTool
