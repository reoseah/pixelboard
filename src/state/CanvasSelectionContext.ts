import { makePersisted } from '@solid-primitives/storage'
import { Accessor, createContext, createRoot } from 'solid-js'
import { createStore, reconcile, Store } from 'solid-js/store'

export type CanvasSelection = {
  deselect: () => void
  getBounds: Accessor<{ height: number, width: number, x: number, y: number }>

  parts: Store<SelectionPart[]>

  prevParts: () => [] | SelectionPart[]
  reselect: () => void
  selectRectangle: (mode: SelectionMode, x: number, y: number, width: number, height: number) => void
}

// For simplicity, only rectangle selections are supported.
// Arbitrary selections like needed for Magic Wand tool
// might be quite hard to implement, especially with infinite canvas
// and there are more critical features to implement first.
export type SelectionPart =
    | { height: number, type: 'rectangle', width: number, x: number, y: number }

export type SelectionMode =
    | 'replace'

export const VirtualCanvasSelection: CanvasSelection = createRoot(() => {
  const store = createStore<SelectionPart[]>([])
  const [parts, setParts] = makePersisted(store, { name: 'selection-parts' })

  const getBounds = () => {
    const [minX, minY, maxX, maxY] = parts.reduce((bounds, part) => {
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

  let prevParts: SelectionPart[] = []
  const deselect = () => {
    prevParts = JSON.parse(JSON.stringify(store[0]))
    setParts(reconcile([]))
  }

  const reselect = () => {
    if (prevParts.length === 0) {
      return
    }
    setParts(reconcile(prevParts))
  }

  const selectRectangle = (mode: SelectionMode, x: number, y: number, width: number, height: number) => {
    if (mode === 'replace') {
      if (width === 0 || height === 0) {
        setParts(reconcile([]))
        return
      }
      setParts(reconcile([{ height, type: 'rectangle', width, x, y }]))
    }
  }

  return {
    deselect,
    getBounds,
    parts,
    prevParts: () => prevParts,
    reselect,
    selectRectangle,
  }
})

export const CanvasSelectionContext = createContext(VirtualCanvasSelection)

export default CanvasSelectionContext
