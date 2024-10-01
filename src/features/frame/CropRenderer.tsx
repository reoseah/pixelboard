import "./CropRenderer.css"
import { createSignal, JSX, onMount, Show, useContext } from "solid-js"
import { WhiteboardContext } from "../../state/WhiteboardContext"
import { CurrentToolContext } from "../../state/CurrentToolContext"
import { ViewportPositionContext } from "../../state/ViewportPositionContext"
import useClickOutside from "../../hooks/useClickOutside"
import { Crop } from "./crop"

const CropRenderer = (props: {
    id: string,
    element: Crop
}) => {
    const viewport = useContext(ViewportPositionContext)
    const whiteboard = useContext(WhiteboardContext)

    return (
        <div
            class="crop"
            data-selectable
            data-element-id={props.id}
            data-selected={whiteboard.selected().includes(props.id)}
            style={{
                left: `${props.element.x * viewport.scale()}px`,
                top: `${props.element.y * viewport.scale()}px`,
                width: `${props.element.width * viewport.scale()}px`,
                height: `${props.element.height * viewport.scale()}px`,
            }}
        >
            <Show
                when={whiteboard.editingTitle() === props.id}
                fallback={<FrameTitle id={props.id} node={props.element} />}
            >
                <FrameTitleEditor id={props.id} node={props.element} />
            </Show>
        </div>
    )
}

export default CropRenderer

const FrameTitle = (props: {
    id: string,
    node: Crop
}) => {
    const currentTool = useContext(CurrentToolContext)
    const whiteboard = useContext(WhiteboardContext)

    const style = (): JSX.CSSProperties => currentTool.id() === "select" ? {
        "pointer-events": "auto"
    } : {
        "pointer-events": "none"
    }

    return (
        <div
            class="crop-title"
            style={style()}
            data-element-title
            ondblclick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                if (currentTool.id() === "select") {
                    whiteboard.setEditingTitle(props.id)
                }
            }}
        >
            {props.node.title ?? "Frame"}
        </div>
    )
}

const FrameTitleEditor = (props: {
    id: string,
    node: Crop
}) => {
    const [value, setValue] = createSignal(props.node.title ?? "Frame")
    const whiteboard = useContext(WhiteboardContext)
    let input!: HTMLInputElement
    let widthHelper!: HTMLSpanElement

    const updateTitle = () => {
        whiteboard.set(props.id, {
            ...props.node,
            title: value().trim() || null
        })

        whiteboard.setEditingTitle(null)
    }

    onMount(() => {
        input.focus()
        input.select()
        updateWidth()
    })

    useClickOutside(() => input, () => {
        updateTitle()
    })

    const updateWidth = () => {
        widthHelper.innerText = value()
        input.style.width = `${widthHelper.offsetWidth}px`
    }

    return (
        <>
            <span
                ref={el => widthHelper = el}
                style={{
                    visibility: "hidden",
                    position: "absolute",
                    "white-space": "pre",
                    "font-size": ".75rem",
                }}
            ></span>
            <input
                type="text"
                class="crop-title-editor"
                value={value()}
                oninput={(e) => {
                    setValue(e.currentTarget.value)
                    updateWidth()
                }}
                autocomplete='off'
                onchange={updateTitle}
                onblur={updateTitle}
                onkeydown={(e) => {
                    if (e.key === "Enter") updateTitle()
                    if (e.key === "Escape") {
                        setValue(props.node.title ?? "Frame")
                        whiteboard.setEditingTitle(null)
                    }
                }}
                ref={el => input = el}
            />
        </>
    )
}