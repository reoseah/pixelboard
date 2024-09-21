import Tool from "./tool"
import SelectionIcon from "../../assets/icons/selection.svg"
import { ViewportPositionContext } from "../../state/ViewportPosition"
import { createSignal, Show, useContext } from "solid-js"

const createSelectRectangle = (): Tool => {
    const [viewport, viewportActions] = useContext(ViewportPositionContext)!

    const [initialPos, setInitialPos] = createSignal<{ x: number, y: number }>({ x: 0, y: 0 })
    const [currentPos, setCurrentPos] = createSignal<{ x: number, y: number }>({ x: 0, y: 0 })
    const [dragging, setDragging] = createSignal(false)

    const handleMouseDown = (e: MouseEvent) => {
        if (e.button !== 0) {
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

        setDragging(false)
        setInitialPos({ x: 0, y: 0 })
        setCurrentPos({ x: 0, y: 0 })
    }

    const viewportComponent = () => {
        const left = () => Math.min(Math.round(initialPos().x), Math.round(currentPos().x))
        const top = () => Math.min(Math.round(initialPos().y), Math.round(currentPos().y))
        const width = () => Math.abs(Math.round(currentPos().x) - Math.round(initialPos().x))
        const height = () => Math.abs(Math.round(currentPos().y) - Math.round(initialPos().y))

        return (
            <Show when={dragging()}>
                <svg
                    style={{
                        position: "absolute",
                        top: `${top() * viewport.scale()}px`,
                        left: `${left() * viewport.scale()}px`,
                        "pointer-events": "none",
                        "shape-rendering": "crispEdges",
                        "z-index": 50
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