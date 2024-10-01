import "./SelectRectanglePreview.css"
import { useContext, Show } from "solid-js"
import { RectangleDragContext } from "../../state/RectangleDragContext"
import { ViewportPositionContext } from "../../state/ViewportPositionContext"

const SelectRectanglePreview = () => {
  const viewport = useContext(ViewportPositionContext)

  const { initialPos, currentPos, dragging, } = useContext(RectangleDragContext)

  const left = () => Math.min(Math.round(initialPos().x), Math.round(currentPos().x))
  const top = () => Math.min(Math.round(initialPos().y), Math.round(currentPos().y))
  const width = () => Math.abs(Math.round(currentPos().x) - Math.round(initialPos().x))
  const height = () => Math.abs(Math.round(currentPos().y) - Math.round(initialPos().y))

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
          width={Math.max(2, width() * viewport.scale())}
          height={Math.max(2, height() * viewport.scale())}
          stroke="white"
          stroke-width="1"
          stroke-dasharray="3 3"
          stroke-dashoffset="0" >
          <animate attributeName="stroke-dashoffset" from="0" to="6" dur=".5s" repeatCount="indefinite" />
        </rect>
        <rect
          x={.5}
          y={.5}
          width={Math.max(2, width() * viewport.scale())}
          height={Math.max(2, height() * viewport.scale())}
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

export default SelectRectanglePreview