import "./ViewportContainer.css"
import { createSignal, JSXElement, onCleanup, useContext } from "solid-js"
import { ViewportPositionContext } from "../state/ViewportPosition"

const ViewportContainer = (props: { children: JSXElement }) => {
    const [position, positionActions] = useContext(ViewportPositionContext)
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
            positionActions.move(e.movementX / position.scale(), e.movementY / position.scale())
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
        if (shouldSkipInteraction(e)) {
            return
        }
        if (e.ctrlKey) {
            e.preventDefault()
            if (e.deltaY < 0) {
                positionActions.zoomIn()
            } else {
                positionActions.zoomOut()
            }
        } else {
            const change = e.deltaY / position.scale()
            if (e.shiftKey) {
                positionActions.move(change, 0)
            } else {
                positionActions.move(0, change)
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

    const translationX = () => Math.round(innerWidth() / 2 + position.x() * position.scale())
    const translationY = () => Math.round(innerHeight() / 2 + position.y() * position.scale())

    return (
        <div
            class="viewport"
            data-dragging={dragging()}
            onmousedown={handleMouseDown}
        >
            <svg
                class="viewport-pixel-grid"
                data-hidden={position.scale() < 10}
                width={innerWidth()}
                height={innerHeight()}
            >
                <defs>
                    <pattern
                        id="pixel-grid-pattern"
                        width={position.scale()}
                        height={position.scale()}
                        patternUnits="userSpaceOnUse"
                    >
                        <rect width="1" height="1" fill="#505050" />
                    </pattern>
                </defs>
                <rect
                    width="100%"
                    height="100%"
                    fill="url(#pixel-grid-pattern)"
                    transform={`translate(${translationX() % position.scale()} ${translationY() % position.scale()})`}
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
