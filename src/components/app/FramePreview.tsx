import { Show, useContext } from 'solid-js'

import RectangleDragContext from '../../state/RectangleDragContext'
import ViewportPositionContext from '../../state/ViewportPositionContext'
import './FramePreview.css'

const FramePreview = () => {
  const viewport = useContext(ViewportPositionContext)

  const { dragging, height, left, top, width } = useContext(RectangleDragContext)!

  return (
    <Show when={dragging()}>
      <div
        class="frame-preview"
        style={{
          height: `${height() * viewport.scale()}px`,
          left: `${left() * viewport.scale()}px`,
          top: `${top() * viewport.scale()}px`,
          width: `${width() * viewport.scale()}px`,
        }}
      >
        <div
          class="frame-preview-dimensions"
          style={{
            left: `calc(${width() * viewport.scale()}px + .5rem)`,
            top: `calc(${height() * viewport.scale()}px + .5rem)`,
          }}
        >
          {width()}
          {' '}
          ×
          {height()}
        </div>
      </div>
    </Show>
  )
}

export default FramePreview
