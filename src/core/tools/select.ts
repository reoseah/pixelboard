import { useContext, onCleanup, createSignal } from 'solid-js'
import Tool, { isViewportClick } from './tool'
import { BoardContext } from '../../state/BoardElements'
import CursorIcon from '../../assets/icons/cursor.svg'
import { ViewportPositionContext } from '../../state/ViewportPosition'
import { SharedRectangleStateContext } from '../../state/SharedRectangleState'

const createSelect = (): Tool => {
    return {
        label: "Select/Move",
        icon: CursorIcon,
        use: () => {
            const {
                initialPos,
                setInitialPos,
                currentPos,
                setCurrentPos,
                dragging,
                setDragging
            } = useContext(SharedRectangleStateContext)
            const [toolState, setToolState] = createSignal<"idle" | "move" | "selection_box">("idle")

            const [, viewport] = useContext(ViewportPositionContext)

            const [elements, elementActions] = useContext(BoardContext)
            let clickTime = 0
            let clickId: string | null = null

            const handleMouseDown = (e: MouseEvent) => {
                if (!isViewportClick(e)) {
                    return
                }

                e.preventDefault()

                const targetedId = (e.target as HTMLElement).closest("[data-selectable][data-element-id]")?.getAttribute("data-element-id") ?? null
                if (targetedId) {
                    const isTitle = (e.target as Element)?.hasAttribute("data-element-title")
                    if (isTitle) {
                        if (Date.now() - clickTime < 300 && clickId === targetedId) {
                            elementActions.setEditingTitle(targetedId)
                            return
                        } else {
                            clickTime = Date.now()
                            clickId = targetedId
                        }
                    }
                    const selection = modifySelection(elements.selected(), targetedId, e.shiftKey)
                    elementActions.select(selection)
                    if (selection.length > 0) {
                        setToolState("move")
                        const x = viewport.toCanvasX(e.clientX)
                        const y = viewport.toCanvasY(e.clientY)
                        setInitialPos({ x, y })
                        setCurrentPos({ x, y })
                    }

                    return
                }

                setToolState("selection_box")
                const x = viewport.toCanvasX(e.clientX)
                const y = viewport.toCanvasY(e.clientY)
                setInitialPos({ x, y })
                setCurrentPos({ x, y })
                elementActions.select([])
            }

            const handleMouseMove = (e: MouseEvent) => {
                switch (toolState()) {
                    case "selection_box": {
                        const x = viewport.toCanvasX(e.clientX)
                        const y = viewport.toCanvasY(e.clientY)
                        setCurrentPos({ x, y })

                        // TODO: highlight nodes within selection box
                        break
                    }
                }
            }

            const handleMouseUp = (e: MouseEvent) => {
                switch (toolState()) {
                    case "selection_box": {
                        const minX = Math.min(initialPos().x, currentPos().x)
                        const minY = Math.min(initialPos().y, currentPos().y)
                        const maxX = Math.max(initialPos().x, currentPos().x)
                        const maxY = Math.max(initialPos().y, currentPos().y)

                        const selection = elementActions.getElementsInside(minX, minY, maxX - minX, maxY - minY)
                        elementActions.select(selection)

                        break
                    }
                }

                setToolState("idle")
                setDragging(false)
                setInitialPos({ x: 0, y: 0 })
                setCurrentPos({ x: 0, y: 0 })
            }

            document.addEventListener("mousedown", handleMouseDown)
            document.addEventListener("mousemove", handleMouseMove)
            document.addEventListener("mouseup", handleMouseUp)

            onCleanup(() => {
                document.removeEventListener("mousedown", handleMouseDown)
                document.removeEventListener("mousemove", handleMouseMove)
                document.removeEventListener("mouseup", handleMouseUp)
            })
        }
    }
}

const modifySelection = (selection: string[], id: string, shiftKey: boolean): string[] => {
    if (shiftKey) {
        if (selection.includes(id)) {
            return selection.filter(selectedId => selectedId !== id)
        } else {
            return [...selection, id]
        }
    } else {
        return [id]
    }
}

export default createSelect
