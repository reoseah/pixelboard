import { createContext, createRoot, createSignal } from "solid-js";

const SharedRectangleState = createRoot(() => {
    const [initialPos, setInitialPos] = createSignal<{ x: number, y: number }>({ x: 0, y: 0 })
    const [currentPos, setCurrentPos] = createSignal<{ x: number, y: number }>({ x: 0, y: 0 })
    const [dragging, setDragging] = createSignal(false)

    return {
        initialPos,
        setInitialPos,
        currentPos,
        setCurrentPos,
        dragging,
        setDragging
    }
})

export default SharedRectangleState

export const SharedRectangleStateContext = createContext<typeof SharedRectangleState>(SharedRectangleState)