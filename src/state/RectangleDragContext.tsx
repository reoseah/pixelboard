import { createContext, createSignal } from 'solid-js'

// Shared state between a few tools that drag a rectangle on the canvas
// such as select (when clicking and dragging on empty space), rectangular selection,
// and crop tool.
// It's raised from the tool components so that it can be shared between them,
// allowing to switch between tools with shortcuts without losing the state.
export const createRectangleDragState = () => {
  const [dragging, setDragging] = createSignal(false)
  // Coordinates in project space, not the screen position,
  // apply toCanvasX/Y in ViewportPositionContext before assigning.
  // It's up to tools to floor or round these values if needed
  const [initialPos, setInitialPos] = createSignal<{ x: number, y: number }>({ x: 0, y: 0 })
  const [currentPos, setCurrentPos] = createSignal<{ x: number, y: number }>({ x: 0, y: 0 })

  const left = () => Math.min(Math.round(initialPos().x), Math.round(currentPos().x))
  const top = () => Math.min(Math.round(initialPos().y), Math.round(currentPos().y))
  const width = () => Math.abs(Math.round(currentPos().x) - Math.round(initialPos().x))
  const height = () => Math.abs(Math.round(currentPos().y) - Math.round(initialPos().y))

  document.addEventListener('mouseup', (e: MouseEvent) => {
    if (e.button !== 0) {
      return
    }
    if (!dragging()) {
      return
    }

    // delays the reset so the actual event handlers can run
    requestAnimationFrame(() => {
      setDragging(false)
      setInitialPos({ x: 0, y: 0 })
      setCurrentPos({ x: 0, y: 0 })
    })
  })

  return {
    dragging,
    setDragging,
    initialPos,
    setInitialPos,
    currentPos,
    setCurrentPos,
    left,
    top,
    width,
    height,
  }
}

export type RectangleDragState = ReturnType<typeof createRectangleDragState>

const RectangleDragContext = createContext<RectangleDragState>()

export default RectangleDragContext
