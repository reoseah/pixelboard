import { Show, useContext } from 'solid-js'

import { RectangleDragContext } from '../../state/RectangleDragContext'
import { ViewportPositionContext } from '../../state/ViewportPositionContext'
import './RectangleSelectionPreview.css'

const SelectRectanglePreview = () => {
  const viewport = useContext(ViewportPositionContext)

  const { currentPos, dragging, initialPos } = useContext(RectangleDragContext)!

  const left = () => Math.min(Math.round(initialPos().x), Math.round(currentPos().x))
  const top = () => Math.min(Math.round(initialPos().y), Math.round(currentPos().y))
  const width = () => Math.abs(Math.round(currentPos().x) - Math.round(initialPos().x))
  const height = () => Math.abs(Math.round(currentPos().y) - Math.round(initialPos().y))

  return (
    <Show when={dragging()}>
      <svg
        class="select-rectangle-preview"
        fill="none"
        height={height() * viewport.scale() + 1}
        style={{
          left: `${left() * viewport.scale()}px`,
          top: `${top() * viewport.scale()}px`,
        }}
        width={width() * viewport.scale() + 1}
      >
        <rect
          height={Math.max(2, height() * viewport.scale())}
          stroke="white"
          stroke-dasharray="3 3"
          stroke-dashoffset="0"
          stroke-width="1"
          width={Math.max(2, width() * viewport.scale())}
          x={0.5}
          y={0.5}
        >
          <animate attributeName="stroke-dashoffset" dur=".5s" from="0" repeatCount="indefinite" to="6" />
        </rect>
        <rect
          height={Math.max(2, height() * viewport.scale())}
          stroke="black"
          stroke-dasharray="3 3"
          stroke-dashoffset="3"
          stroke-width="1"
          width={Math.max(2, width() * viewport.scale())}
          x={0.5}
          y={0.5}
        >
          <animate attributeName="stroke-dashoffset" dur=".5s" from="3" repeatCount="indefinite" to="9" />
        </rect>
      </svg>
      <div
        class="select-rectangle-dimensions"
        style={{
          left: `${(left() + width()) * viewport.scale() + 8}px`,
          top: `${(top() + height()) * viewport.scale() + 8}px`,
        }}
      >
        {width()}
        {' '}
        ×
        {height()}
      </div>
    </Show>
  )
}

export default SelectRectanglePreview
