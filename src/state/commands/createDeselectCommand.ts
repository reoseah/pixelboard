import type { CanvasSelection } from '../../state/CanvasSelectionContext'
import type { Command } from '../../types/commands'

const createDeselectCommand = (selection: CanvasSelection): Command => ({
  id: 'deselect',
  label: () => 'Deselect',
  isDisabled: () => selection.parts.length === 0,
  execute: () => {
    selection.deselect()
  },
})

export default createDeselectCommand
