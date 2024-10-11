import type { Command } from '../../types/commands'
import type { CanvasSelection } from '../CanvasSelectionContext'
import type { Registry } from '../RegistryContext'
import type { VirtualCanvasState } from '../VirtualCanvasContext'

import { getCanvasBounds } from '../VirtualCanvasContext'

export default (selection: CanvasSelection, canvas: VirtualCanvasState, registry: Registry['rasterElements']): Command => ({
  id: 'select_all',
  label: () => 'Select All',
  isDisabled: () => selection.deselected.length === 0,
  execute: () => {
    const { x, y, width, height } = getCanvasBounds(canvas, registry)
    if (width !== 0 && height !== 0) {
      selection.selectRectangle('replace', x, y, width, height)
    }
  },
})
