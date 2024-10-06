import type { Command } from '../../types/commands'
import type { NonRasterElementState } from '../NonRasterElementsContext'

const createRenameElementCommand = (whiteboard: NonRasterElementState): Command => ({
  id: 'rename_element',
  label: () => 'Rename',
  isDisabled: () => whiteboard.selected().length !== 1,
  execute: () => {
    const id = whiteboard.selected()[0]
    whiteboard.setTitleBeingEdited(id)
  },
})

export default createRenameElementCommand
