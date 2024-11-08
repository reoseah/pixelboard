import { makePersisted } from '@solid-primitives/storage'
import { createContext } from 'solid-js'
import { createStore, reconcile, Store } from 'solid-js/store'

import { SelectionPart, SelectionToolMode } from '../types/raster_selection.ts'

export type CanvasSelection = {
  parts: Store<SelectionPart[]>
  deselected: Store<SelectionPart[]>

  clear: () => void

  deselect: () => void
  reselect: () => void
  selectRectangle: (mode: SelectionToolMode, x: number, y: number, width: number, height: number) => void
}

const CanvasSelectionContext = createContext<CanvasSelection>(undefined as unknown as CanvasSelection)

export default CanvasSelectionContext

export const createCanvasSelection = (): CanvasSelection => {
  const [parts, setParts] = makePersisted(createStore<SelectionPart[]>([]), { name: 'selection' })
  const [deselected, setDeselected] = makePersisted(createStore<SelectionPart[]>([]), { name: 'deselected-selection' })

  const clear = () => {
    setParts(reconcile([]))
    setDeselected(reconcile([]))
  }

  const deselect = () => {
    setDeselected(parts)
    setParts(reconcile([]))
  }

  const reselect = () => {
    if (deselected.length === 0) {
      return
    }
    setParts(reconcile(deselected))
  }

  const selectRectangle = (mode: SelectionToolMode, x: number, y: number, width: number, height: number) => {
    if (mode === 'replace') {
      if (width === 0 || height === 0) {
        setParts(reconcile([]))
        return
      }
      setParts(reconcile([{ height, type: 'rectangle', width, x, y }]))
    }
  }

  return {
    parts,
    deselected,
    clear,
    deselect,
    reselect,
    selectRectangle,
  }
}

export const getSelectionBounds = (selection: CanvasSelection) => {
  const [minX, minY, maxX, maxY] = selection.parts.reduce((bounds, part) => {
    if (part.type === 'rectangle') {
      return [
        Math.min(bounds[0], part.x),
        Math.min(bounds[1], part.y),
        Math.max(bounds[2], part.x + part.width),
        Math.max(bounds[3], part.y + part.height),
      ]
    }
    return bounds
  }, [Infinity, Infinity, -Infinity, -Infinity])

  return { height: maxY - minY, width: maxX - minX, x: minX, y: minY }
}
