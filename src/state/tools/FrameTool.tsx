import { onCleanup, useContext } from 'solid-js'

import CropIcon from '../../assets/icons/crop.svg'
import FramePreview from '../../components/app/FramePreview'
import { isViewportClick, Tool } from '../../types/tool'
import NonRasterElementsContext from '../NonRasterElementsContext'
import RectangleDragContext from '../RectangleDragContext'
import SelectedToolContext from '../SelectedToolContext'
import ViewportPositionContext from '../ViewportPositionContext'

const FrameTool: Tool = {
  icon: CropIcon,
  label: 'Frame',
  use: () => {
    const viewport = useContext(ViewportPositionContext)
    const whiteboard = useContext(NonRasterElementsContext)
    const selectedTool = useContext(SelectedToolContext)

    const {
      currentPos,
      dragging,
      initialPos,
      setCurrentPos,
      setDragging,
      setInitialPos,
    } = useContext(RectangleDragContext)!

    const handleMouseDown = (e: MouseEvent) => {
      if (!isViewportClick(e)) {
        return
      }
      if (e.button !== 0) {
        return
      }
      const x = viewport.toCanvasX(e.clientX)
      const y = viewport.toCanvasY(e.clientY)

      setInitialPos({ x, y })
      setCurrentPos({ x, y })
      setDragging(true)

      e.preventDefault()
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragging()) {
        return
      }
      const x = viewport.toCanvasX(e.clientX)
      const y = viewport.toCanvasY(e.clientY)
      setCurrentPos({ x, y })
      e.preventDefault()
    }

    const handleMouseUp = (e: MouseEvent) => {
      if (e.button !== 0) {
        return
      }
      if (!dragging()) {
        return
      }

      const x = Math.round(Math.min(initialPos().x, currentPos().x))
      const y = Math.round(Math.min(initialPos().y, currentPos().y))
      const maxX = Math.round(Math.max(initialPos().x, currentPos().x))
      const maxY = Math.round(Math.max(initialPos().y, currentPos().y))
      const width = maxX - x
      const height = maxY - y

      if (width > 0 && height > 0) {
        const id = crypto.randomUUID()
        whiteboard.set(id, {
          height,
          type: 'crop',
          width,
          x,
          y,
        })
        whiteboard.select([id])
      }

      setDragging(false)
      setInitialPos({ x: 0, y: 0 })
      setCurrentPos({ x: 0, y: 0 })
      selectedTool.selectId('select')
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDragging(false)
        setInitialPos({ x: 0, y: 0 })
        setCurrentPos({ x: 0, y: 0 })
      }
    }

    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('keydown', handleKeyDown)

    onCleanup(() => {
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('keydown', handleKeyDown)
    })
  },
  viewport: FramePreview,
}

export default FrameTool
