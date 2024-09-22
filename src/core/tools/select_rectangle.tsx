import "./select_rectangle.css"
import Tool, { isViewportClick } from "./tool"
import SelectionIcon from "../../assets/icons/selection.svg"
import { ViewportPositionContext } from "../../state/ViewportPosition"
import { createSignal, Show, useContext } from "solid-js"
import { SelectionContext } from "../../state/Selection"

const createSelectRectangle = (): Tool => {
    const [viewport, viewportActions] = useContext(ViewportPositionContext)
    const [, selectionActions] = useContext(SelectionContext)

    const [initialPos, setInitialPos] = createSignal<{ x: number, y: number }>({ x: 0, y: 0 })
    const [currentPos, setCurrentPos] = createSignal<{ x: number, y: number }>({ x: 0, y: 0 })
    const [dragging, setDragging] = createSignal(false)

    const left = () => Math.min(Math.round(initialPos().x), Math.round(currentPos().x))
    const top = () => Math.min(Math.round(initialPos().y), Math.round(currentPos().y))
    const width = () => Math.abs(Math.round(currentPos().x) - Math.round(initialPos().x))
    const height = () => Math.abs(Math.round(currentPos().y) - Math.round(initialPos().y))

    const handleMouseDown = (e: MouseEvent) => {
        if (e.button !== 0 || !isViewportClick(e)) {
            return
        }
        const x = viewportActions.toCanvasX(e.clientX)
        const y = viewportActions.toCanvasY(e.clientY)

        setInitialPos({ x, y })
        setCurrentPos({ x, y })
        setDragging(true)
    }

    const handleMouseMove = (e: MouseEvent) => {
        if (!dragging()) {
            return
        }
        const x = viewportActions.toCanvasX(e.clientX)
        const y = viewportActions.toCanvasY(e.clientY)
        setCurrentPos({ x, y })
    }

    const handleMouseUp = (e: MouseEvent) => {
        if (e.button !== 0) {
            return
        }
        if (!dragging()) {
            return
        }

        selectionActions.selectRectangle("replace", left(), top(), width(), height())

        setDragging(false)
        setInitialPos({ x: 0, y: 0 })
        setCurrentPos({ x: 0, y: 0 })
    }

    const viewportComponent = () => {
        return (
            <Show when={dragging()}>
                <svg
                    class="select-rectangle-preview"
                    style={{
                        top: `${top() * viewport.scale()}px`,
                        left: `${left() * viewport.scale()}px`,
                    }}
                    width={width() * viewport.scale() + 1}
                    height={height() * viewport.scale() + 1}
                    fill="none" >
                    <rect
                        x={.5}
                        y={.5}
                        width={width() * viewport.scale()}
                        height={height() * viewport.scale()}
                        stroke="white"
                        stroke-width="1"
                        stroke-dasharray="3 3"
                        stroke-dashoffset="0" >
                        <animate attributeName="stroke-dashoffset" from="0" to="6" dur=".5s" repeatCount="indefinite" />
                    </rect>
                    <rect
                        x={.5}
                        y={.5}
                        width={width() * viewport.scale()}
                        height={height() * viewport.scale()}
                        stroke="black"
                        stroke-width="1"
                        stroke-dasharray="3 3"
                        stroke-dashoffset="3" >
                        <animate attributeName="stroke-dashoffset" from="3" to="9" dur=".5s" repeatCount="indefinite" />
                    </rect>
                </svg>
                <div
                    class="select-rectangle-dimensions"
                    style={{
                        left: `${(left() + width()) * viewport.scale() + 8}px`,
                        top: `${(top() + height()) * viewport.scale() + 8}px`,
                    }}
                >
                    {width()} × {height()}
                </div>
            </Show>
        )
    }

    return {
        label: "Select Rectangle",
        icon: SelectionIcon,
        viewport: viewportComponent,
        onSelect: () => {
            document.addEventListener("mousedown", handleMouseDown)
            document.addEventListener("mousemove", handleMouseMove)
            document.addEventListener("mouseup", handleMouseUp)
        },
        onDeselect: () => {
            document.removeEventListener("mousedown", handleMouseDown)
            document.removeEventListener("mousemove", handleMouseMove)
            document.removeEventListener("mouseup", handleMouseUp)
            setDragging(false)
            setInitialPos({ x: 0, y: 0 })
            setCurrentPos({ x: 0, y: 0 })
        },
    }
}

export default createSelectRectangle