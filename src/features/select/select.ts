import { createSignal, onCleanup, useContext } from 'solid-js'

import CursorIcon from '../../assets/icons/cursor.svg'
import { RectangleDragContext } from '../../state/RectangleDragContext'
import { ViewportPositionContext } from '../../state/ViewportPositionContext'
import { WhiteboardContext } from '../../state/WhiteboardContext'
import { isViewportClick, Tool } from '../../types/tool'
import SelectionBox from './SelectionBox'

const SelectTool: Tool = {
  icon: CursorIcon,
  label: 'Select/Move',
  use: () => {
    const {
      // dragging,
      setDragging,

      initialPos,
      setInitialPos,

      currentPos,
      setCurrentPos,
    } = useContext(RectangleDragContext)
    const [toolState, setToolState] = createSignal<'idle' | 'move' | 'selection_box'>('idle')

    const viewport = useContext(ViewportPositionContext)

    const whiteboard = useContext(WhiteboardContext)
    let clickTime = 0
    let clickId: null | string = null

    const handleMouseDown = (e: MouseEvent) => {
      if (!isViewportClick(e)) {
        return
      }

      e.preventDefault()

      const targetedId = (e.target as HTMLElement).closest('[data-selectable][data-element-id]')?.getAttribute('data-element-id') ?? null
      if (targetedId) {
        const isTitle = (e.target as Element)?.hasAttribute('data-element-title')
        if (isTitle) {
          if (Date.now() - clickTime < 300 && clickId === targetedId) {
            whiteboard.setEditingTitle(targetedId)
            return
          }
          else {
            clickTime = Date.now()
            clickId = targetedId
          }
        }
        const selection = modifySelection(whiteboard.selected(), targetedId, e.shiftKey)
        whiteboard.select(selection)
        if (selection.length > 0) {
          setToolState('move')
          const x = viewport.toCanvasX(e.clientX)
          const y = viewport.toCanvasY(e.clientY)
          setInitialPos({ x, y })
          setCurrentPos({ x, y })
        }

        return
      }

      setToolState('selection_box')
      const x = viewport.toCanvasX(e.clientX)
      const y = viewport.toCanvasY(e.clientY)
      setInitialPos({ x, y })
      setCurrentPos({ x, y })
      setDragging(true)
      whiteboard.select([])
    }

    const handleMouseMove = (e: MouseEvent) => {
      switch (toolState()) {
        case 'selection_box': {
          const x = viewport.toCanvasX(e.clientX)
          const y = viewport.toCanvasY(e.clientY)
          setCurrentPos({ x, y })

          // TODO: highlight nodes within selection box
          break
        }
      }
    }

    const handleMouseUp = (/* e: MouseEvent */) => {
      switch (toolState()) {
        case 'selection_box': {
          const minX = Math.min(initialPos().x, currentPos().x)
          const minY = Math.min(initialPos().y, currentPos().y)
          const maxX = Math.max(initialPos().x, currentPos().x)
          const maxY = Math.max(initialPos().y, currentPos().y)

          const selection = whiteboard.getElementsInside(minX, minY, maxX - minX, maxY - minY)
          whiteboard.select(selection)

          break
        }
      }

      setToolState('idle')
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
  viewport: SelectionBox,
}

const modifySelection = (selection: string[], id: string, shiftKey: boolean): string[] => {
  if (shiftKey) {
    if (selection.includes(id)) {
      return selection.filter(selectedId => selectedId !== id)
    }
    else {
      return [...selection, id]
    }
  }
  else {
    return [id]
  }
}

export default SelectTool
