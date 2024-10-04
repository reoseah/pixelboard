import { Show, useContext } from 'solid-js'

import RectangleDragContext from '../../state/RectangleDragContext'
import ViewportPositionContext from '../../state/ViewportPositionContext'
import './SelectionBox.css'

const SelectionBox = () => {
  const viewport = useContext(ViewportPositionContext)

  const { dragging, height, left, top, width } = useContext(RectangleDragContext)!

  return (
    <Show when={dragging()}>
      <div
        class="selection-box"
        style={{
          height: `${height() * viewport.scale()}px`,
          left: `${left() * viewport.scale()}px`,
          top: `${top() * viewport.scale()}px`,
          width: `${width() * viewport.scale()}px`,
        }}
      />
    </Show>
  )
}

export default SelectionBox
