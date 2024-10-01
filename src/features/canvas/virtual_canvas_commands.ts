import TrashCanIcon from '../../assets/icons/trash-can.svg'
import { DefaultCanvas } from '../../state/VirtualCanvasContext'
import { DefaultWhiteboard } from '../../state/WhiteboardContext'
import { Command } from '../../types/commands'

// TODO: this does not belong here, should be in some `project_commands` file
export const ClearProject: Command = {
  execute: () => {
    const canvas = DefaultCanvas
    const whiteboard = DefaultWhiteboard
    canvas.clear()
    whiteboard.clear()
  },
  icon: TrashCanIcon,
  id: 'clear_project',
  label: 'Clear Project',
}
