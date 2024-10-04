import type { Command } from '../../types/commands'
import type { YjsState } from '../YjsContext'

import TrashCanIcon from '../../assets/icons/trash-can.svg'

const createClearProjectCommand = (yjs: YjsState): Command => ({
  id: 'clear_project',
  label: 'Clear Project',
  icon: TrashCanIcon,
  execute: () => {
    if (confirm('This will delete all of your work. Are you sure?')) {
      yjs.clear()
    }
  },
})

export default createClearProjectCommand
