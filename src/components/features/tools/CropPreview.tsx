import "./CropPreview.css"
import { Show, useContext } from "solid-js"
import { SharedRectangleStateContext } from "../../../state/RectangleToolsState"
import { ViewportPositionContext } from "../../../state/ViewportPosition"

const CropPreview = () => {
    const [viewport] = useContext(ViewportPositionContext)

    const { initialPos, currentPos, dragging, } = useContext(SharedRectangleStateContext)

    const left = () => Math.min(Math.round(initialPos().x), Math.round(currentPos().x))
    const top = () => Math.min(Math.round(initialPos().y), Math.round(currentPos().y))
    const width = () => Math.abs(Math.round(currentPos().x) - Math.round(initialPos().x))
    const height = () => Math.abs(Math.round(currentPos().y) - Math.round(initialPos().y))

    return (
        <Show when={dragging()}>
            <div class="crop-preview"
                style={{
                    left: `${left() * viewport.scale()}px`,
                    top: `${top() * viewport.scale()}px`,
                    width: `${width() * viewport.scale()}px`,
                    height: `${height() * viewport.scale()}px`,
                }}
            >
                <div
                    class="crop-preview-dimensions"
                    style={{
                        left: `calc(${width() * viewport.scale()}px + .5rem)`,
                        top: `calc(${height() * viewport.scale()}px + .5rem)`,
                    }}
                >
                    {width()} × {height()}
                </div>
            </div>
        </Show>
    )
}

export default CropPreview