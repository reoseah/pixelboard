import "./CropRenderer.css"
import { createSignal, JSX, onMount, Show, useContext } from "solid-js"
import { Crop } from "../../../core/board_elements/crop"
import { ViewportPositionContext } from "../../../state/ViewportPosition"
import useClickOutside from "../../../hooks/useClickOutside"
import { CurrentToolContext } from "../../../state/CurrentTool"
import { BoardContext, BoardElements } from "../../../state/BoardElements"

const CropRenderer = (props: {
    id: string,
    element: Crop
}) => {
    const [viewport] = useContext(ViewportPositionContext)
    const [elements, elementActions] = useContext(BoardContext)

    return (
        <div
            class="crop"
            data-node-id={props.id}
            data-drawable
            data-selectable
            data-selected={elements.selected().includes(props.id)}
            style={{
                left: `${props.element.x * viewport.scale()}px`,
                top: `${props.element.y * viewport.scale()}px`,
                width: `${props.element.width * viewport.scale()}px`,
                height: `${props.element.height * viewport.scale()}px`,
            }}
        >
            <Show
                when={elements.editingTitle() === props.id}
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
    const [, elementActions] = useContext(BoardContext)

    const style = (): JSX.CSSProperties => currentTool.id() === "select" ? {
        "pointer-events": "auto"
    } : {
        "pointer-events": "none"
    }

    return (
        <div
            class="crop-title"
            style={style()}
            data-frame-title
            ondblclick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                if (currentTool.id() === "select") {
                    elementActions.setEditingTitle(props.id)
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
    const [, elementActions] = useContext(BoardContext)
    let input!: HTMLInputElement
    let widthHelper!: HTMLSpanElement

    const updateTitle = () => {
        elementActions.set(props.id, {
            ...props.node,
            title: value().trim() || null
        })

        elementActions.setEditingTitle(null)
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
                        elementActions.setEditingTitle(null)
                    }
                }}
                ref={el => input = el}
            />
        </>
    )
}