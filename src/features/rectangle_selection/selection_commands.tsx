import CanvasSelection from '../../state/CanvasSelection'
import { DefaultCanvas } from '../../state/VirtualCanvasContext'
import { Command } from '../../types/commands'

export const Deselect: Command = {
  execute: () => {
    const selection = CanvasSelection
    selection.deselect()
  },
  id: 'deselect',
  isDisabled: () => {
    const selection = CanvasSelection
    return selection.parts.length === 0
  },
  label: () => 'Deselect',
}

export const Reselect: Command = {
  execute: () => {
    const selection = CanvasSelection
    selection.reselect()
  },
  id: 'reselect',
  isDisabled: () => {
    const selection = CanvasSelection
    return selection.prevParts().length === 0 || selection.parts.length !== 0
  },
  label: () => 'Reselect',
}

export const DeleteSelection: Command = {
  execute: () => {
    const canvas = DefaultCanvas
    const selection = CanvasSelection
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
  id: 'delete_selection',
  isDisabled: () => {
    const selection = CanvasSelection
    return selection.parts.length === 0
  },
  label: () => 'Delete',
}
