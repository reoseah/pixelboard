import "./ViewportContainer.css"
import { createSignal, JSXElement, onCleanup, useContext } from "solid-js"
import { CurrentToolContext } from "../../state/CurrentToolContext"
import { ViewportPositionContext } from "../../state/ViewportPositionContext"

const ViewportContainer = (props: { children: JSXElement }) => {
    const viewport = useContext(ViewportPositionContext)
    const { innerWidth, innerHeight } = useInnerSize()

    const [dragging, setDragging] = createSignal(false)
    let type: "wheel" | "space" | null = null

    const handleMouseDown = (e: MouseEvent) => {
        if (shouldSkipInteraction(e)) {
            return
        }
        if (e.button === 1 && type === null) {
            setDragging(true)
            type = "wheel"
        }
    }
    const handleMouseMove = (e: MouseEvent) => {
        if (dragging()) {
            viewport.move(e.movementX / viewport.scale(), e.movementY / viewport.scale())
        }
    }
    const handleMouseUp = () => {
        if (dragging() && type === "wheel") {
            setDragging(false)
            type = null
        }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
        if (shouldSkipInteraction(e)) {
            return
        }
        if (e.key === " " && type === null) {
            type = "space"
            setDragging(true)
        }
    }
    const handleKeyUp = (e: KeyboardEvent) => {
        if (e.key === " " && type === "space") {
            setDragging(false)
            type = null
        }
    }

    const handleWheel = (e: WheelEvent) => {
        if (shouldSkipInteraction(e) || dragging()) {
            return
        }
        if (e.ctrlKey) {
            e.preventDefault()
            if (e.deltaY < 0) {
                viewport.zoomIn()
            } else {
                viewport.zoomOut()
            }
        } else {
            const change = e.deltaY / viewport.scale()
            if (e.shiftKey) {
                viewport.move(change, 0)
            } else {
                viewport.move(0, change)
            }
        }
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener("keyup", handleKeyUp)
    document.addEventListener("wheel", handleWheel, { passive: false })

    onCleanup(() => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
        document.removeEventListener("keydown", handleKeyDown)
        document.removeEventListener("keyup", handleKeyUp)
        document.removeEventListener("wheel", handleWheel)
    })

    const translationX = () => Math.round(innerWidth() / 2 + viewport.x() * viewport.scale())
    const translationY = () => Math.round(innerHeight() / 2 + viewport.y() * viewport.scale())

    const currentTool = useContext(CurrentToolContext)

    return (
        <div
            class="viewport"
            data-dragging={dragging()}
            data-active-tool={currentTool.id()}
            onmousedown={handleMouseDown}
        >
            <svg
                class="viewport-pixel-grid"
                data-hidden={viewport.scale() < 10}
                width={innerWidth()}
                height={innerHeight()}
            >
                <defs>
                    <pattern
                        id="pixel-grid-pattern"
                        width={viewport.scale()}
                        height={viewport.scale()}
                        patternUnits="userSpaceOnUse"
                    >
                        <rect width="1" height="1" fill="var(--neutral-675)" />
                    </pattern>
                </defs>
                <rect
                    width="100%"
                    height="100%"
                    fill="url(#pixel-grid-pattern)"
                    transform={`translate(${translationX() % viewport.scale()} ${translationY() % viewport.scale()})`}
                />
            </svg>
            <div style={{
                transform: `translate(${translationX()}px, ${translationY()}px)`
            }}>
                {props.children}
            </div>
        </div>
    )
}

export default ViewportContainer

const useInnerSize = () => {
    const [innerWidth, setInnerWidth] = createSignal(window.innerWidth)
    const [innerHeight, setInnerHeight] = createSignal(window.innerHeight)

    const updateInnerSize = () => {
        setInnerWidth(window.innerWidth)
        setInnerHeight(window.innerHeight)
    }
    window.addEventListener("resize", updateInnerSize)
    onCleanup(() => window.removeEventListener("resize", updateInnerSize))

    return { innerWidth, innerHeight }
}

const shouldSkipInteraction = (e: MouseEvent | KeyboardEvent): boolean => {
    const target = e.target as HTMLElement
    const isEditable = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable
    if (isEditable) {
        return true
    }

    return false
}
