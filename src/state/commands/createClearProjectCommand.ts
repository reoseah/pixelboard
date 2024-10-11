import type { Command } from '../../types/commands'
import type { YjsState } from '../YjsContext'

import TrashCanIcon from '../../assets/icons/trash-can.svg'
import { CanvasSelection } from '../CanvasSelectionContext'

const createClearProjectCommand = (yjs: YjsState, selection: CanvasSelection): Command => ({
  id: 'clear_project',
  label: 'Clear Project',
  icon: TrashCanIcon,
  execute: () => {
    if (confirm('This will delete all of your work. Are you sure?')) {
      yjs.clear()
      selection.clear()
    }
  },
})

export default createClearProjectCommand
