import type { CanvasSelection } from '../../state/CanvasSelectionContext'
import type { VirtualCanvasState } from '../../state/VirtualCanvasContext'
import type { Command } from '../../types/commands'

const createDeleteSelectionCommand = (
  selection: CanvasSelection,
  canvas: VirtualCanvasState,
): Command => ({
  id: 'delete_selection',
  label: () => 'Delete selection',
  isDisabled: () => {
    return selection.parts.length === 0
  },
  execute: () => {
    if (selection.parts.length === 1 && selection.parts[0].type === 'rectangle') {
      canvas.add({
        height: selection.parts[0].height,
        type: 'delete_rectangle',
        width: selection.parts[0].width,
        x: selection.parts[0].x,
        y: selection.parts[0].y,
      })
    }
    // TODO
  },
})

export default createDeleteSelectionCommand
