import { createContext, createRoot, createSignal } from "solid-js";

const SharedRectangleState = createRoot(() => {
    const [initialPos, setInitialPos] = createSignal<{ x: number, y: number }>({ x: 0, y: 0 })
    const [currentPos, setCurrentPos] = createSignal<{ x: number, y: number }>({ x: 0, y: 0 })
    const [dragging, setDragging] = createSignal(false)

    // resets state in case of switching from crop/rect selection to a tool like pencil,
    // then releasing the mouse button and switching back to crop/rect selection
    document.addEventListener("mouseup", (e: MouseEvent) => {
        if (e.button !== 0) {
            return
        }
        if (!dragging()) {
            return
        }

        requestAnimationFrame(() => {
            setDragging(false)
            setInitialPos({ x: 0, y: 0 })
            setCurrentPos({ x: 0, y: 0 })
        })
    })

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