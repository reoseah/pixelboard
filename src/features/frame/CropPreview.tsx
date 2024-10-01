import "./CropPreview.css"
import { Show, useContext } from "solid-js"
import { RectangleDragContext } from "../../state/RectangleDragContext"
import { ViewportPositionContext } from "../../state/ViewportPositionContext"

const CropPreview = () => {
  const viewport = useContext(ViewportPositionContext)

  const { dragging, left, top, width, height } = useContext(RectangleDragContext)

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