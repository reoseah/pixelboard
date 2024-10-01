import CommandIcon from '../../assets/icons/command.svg'
import { Tool } from '../../types/tool'
import CommandPalette from './CommandPalette'

const createCommandPalette = (): Tool => {
  return {
    icon: CommandIcon,
    label: 'Command Palette',
    subToolbar: CommandPalette,
  }
}

export default createCommandPalette
