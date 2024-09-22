import "./SelectionRenderer.css"
import { createMemo, For, Show, useContext } from "solid-js"
import { SelectionContext } from "../state/Selection"
import { ViewportPositionContext } from "../state/ViewportPosition"

export const SelectionRenderer = () => {
    const [viewport] = useContext(ViewportPositionContext)
    const [selection, selectionActions] = useContext(SelectionContext)
    const bounds = createMemo(selectionActions.getBounds)

    return (
        <Show when={selection.parts.length !== 0}>
            <svg
                class="selection-renderer"
                width={bounds().width * viewport.scale() + 1}
                height={bounds().height * viewport.scale() + 1}
                style={{
                    left: `${bounds().x * viewport.scale()}px`,
                    top: `${bounds().y * viewport.scale()}px`,
                }}
            >
                <For each={selection.parts}>
                    {(part) => (
                        <Show when={part.type === "rectangle"}>
                            <rect
                                x={part.x - bounds().x + .5}
                                y={part.y - bounds().y + .5}
                                width={part.width * viewport.scale()}
                                height={part.height * viewport.scale()}
                                fill="none"
                                stroke="black"
                                stroke-dasharray="3 3"
                                stroke-dashoffset="0"
                            >
                                <animate attributeName="stroke-dashoffset" from="0" to="6" dur=".5s" repeatCount="indefinite" />
                            </rect>
                            <rect
                                x={part.x - bounds().x + .5}
                                y={part.y - bounds().y + .5}
                                width={part.width * viewport.scale()}
                                height={part.height * viewport.scale()}
                                fill="none"
                                stroke="white"
                                stroke-dasharray="3 3"
                                stroke-dashoffset="3"
                            >
                                <animate attributeName="stroke-dashoffset" from="3" to="9" dur=".5s" repeatCount="indefinite" />
                            </rect>
                        </Show>
                    )}
                </For>
            </svg>
        </Show>
    )
}