import type { Command } from '../../types/commands'
import type { CanvasSelection } from '../CanvasSelectionContext'

const createReselectCommand = (selection: CanvasSelection): Command => ({
  id: 'reselect',
  label: () => 'Reselect',
  isDisabled: () => selection.deselected.length === 0 || selection.parts.length !== 0,
  execute: () => {
    selection.reselect()
  },
})

export default createReselectCommand
