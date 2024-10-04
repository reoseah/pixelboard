import { onCleanup, useContext } from 'solid-js'

import SelectionIcon from '../../assets/icons/selection.svg'
import CanvasSelectionContext from '../CanvasSelectionContext'
import { RectangleDragContext } from '../RectangleDragContext'
import { ViewportPositionContext } from '../ViewportPositionContext'
import { isViewportClick, Tool } from '../../types/tool'
import SelectRectanglePreview from '../../features/rectangle_selection/RectangleSelectionPreview'

const RectangleSelection: Tool = {
  icon: SelectionIcon,
  label: 'Select Rectangle',
  use: () => {
    const selection = useContext(CanvasSelectionContext)!
    const viewport = useContext(ViewportPositionContext)

    const {
      dragging,
      setDragging,

      initialPos,
      setInitialPos,

      currentPos,
      setCurrentPos,
    } = useContext(RectangleDragContext)!

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button !== 0 || !isViewportClick(e)) {
        return
      }
      const x = viewport.toCanvasX(e.clientX)
      const y = viewport.toCanvasY(e.clientY)

      setInitialPos({ x, y })
      setCurrentPos({ x, y })
      setDragging(true)
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragging()) {
        return
      }
      const x = viewport.toCanvasX(e.clientX)
      const y = viewport.toCanvasY(e.clientY)
      setCurrentPos({ x, y })
    }

    const handleMouseUp = (e: MouseEvent) => {
      if (e.button !== 0) {
        return
      }
      if (!dragging()) {
        return
      }

      const left = Math.min(Math.round(initialPos().x), Math.round(currentPos().x))
      const top = Math.min(Math.round(initialPos().y), Math.round(currentPos().y))
      const width = Math.abs(Math.round(currentPos().x) - Math.round(initialPos().x))
      const height = Math.abs(Math.round(currentPos().y) - Math.round(initialPos().y))

      selection.selectRectangle('replace', left, top, width, height)

      setDragging(false)
      setInitialPos({ x: 0, y: 0 })
      setCurrentPos({ x: 0, y: 0 })
    }

    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    onCleanup(() => {
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    })
  },
  viewport: SelectRectanglePreview,
}

export default RectangleSelection
