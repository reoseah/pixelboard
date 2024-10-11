import { createSignal, onCleanup, useContext } from 'solid-js'

import type { Tool } from '../../types/tool'

import CursorIcon from '../../assets/icons/cursor.svg'
import SelectionBox from '../../components/app/SelectionBox'
import { isViewportClick } from '../../types/tool'
import NonRasterElementsContext, { getElementsInside } from '../NonRasterElementsContext'
import RectangleDragContext from '../RectangleDragContext'
import RegistryContext from '../RegistryContext'
import ViewportPositionContext from '../ViewportPositionContext'

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
    } = useContext(RectangleDragContext)!
    const [toolState, setToolState] = createSignal<'idle' | 'move' | 'selection_box'>('idle')

    const viewport = useContext(ViewportPositionContext)
    const whiteboard = useContext(NonRasterElementsContext)
    const registry = useContext(RegistryContext)

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
            whiteboard.setTitleBeingEdited(targetedId)
            return
          }
          else {
            clickTime = Date.now()
            clickId = targetedId
          }
        }
        if (!whiteboard.selected().includes(targetedId)) {
          const selection = modifySelection(whiteboard.selected(), targetedId, e.ctrlKey || e.metaKey)
          whiteboard.select(selection)
        }
        if (whiteboard.selected().length > 0) {
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
      whiteboard.highlight([])
    }

    const handleMouseMove = (e: MouseEvent) => {
      switch (toolState()) {
        case 'idle': {
          const nodeId = (e.target as Element)?.closest('[data-selectable][data-element-id]')?.getAttribute('data-element-id') ?? null
          whiteboard.highlight(nodeId ? [nodeId] : [])

          break
        }
        case 'move': {
          const x = viewport.toCanvasX(e.clientX)
          const y = viewport.toCanvasY(e.clientY)
          const dx = x - currentPos().x
          const dy = y - currentPos().y
          setCurrentPos({ x, y })

          const selection = whiteboard.selected()
          selection.forEach((id) => {
            const element = whiteboard.elements.get(id)!
            const elementType = registry.nonRasterElements[element.type]
            if (elementType.move) {
              const movedElement = elementType.move(element, dx, dy)
              whiteboard.set(id, movedElement)
            }
          })

          break
        }
        case 'selection_box': {
          const x = viewport.toCanvasX(e.clientX)
          const y = viewport.toCanvasY(e.clientY)
          setCurrentPos({ x, y })

          const minX = Math.min(initialPos().x, currentPos().x)
          const minY = Math.min(initialPos().y, currentPos().y)
          const maxX = Math.max(initialPos().x, currentPos().x)
          const maxY = Math.max(initialPos().y, currentPos().y)

          const highlight = getElementsInside(whiteboard, registry.nonRasterElements, minX, minY, maxX - minX, maxY - minY)
          whiteboard.highlight(highlight)

          break
        }
      }
    }

    const handleMouseUp = (/* e: MouseEvent */) => {
      switch (toolState()) {
        case 'move': {
          const selection = whiteboard.selected()
          selection.forEach((id) => {
            const element = whiteboard.elements.get(id)!
            const elementType = registry.nonRasterElements[element.type]
            if (elementType.finishMove) {
              const movedElement = elementType.finishMove(element)
              whiteboard.set(id, movedElement)
            }
          })

          break
        }
        case 'selection_box': {
          const minX = Math.min(initialPos().x, currentPos().x)
          const minY = Math.min(initialPos().y, currentPos().y)
          const maxX = Math.max(initialPos().x, currentPos().x)
          const maxY = Math.max(initialPos().y, currentPos().y)

          const selection = getElementsInside(whiteboard, registry.nonRasterElements, minX, minY, maxX - minX, maxY - minY)
          whiteboard.select(selection)
          whiteboard.highlight([])

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
      whiteboard.highlight([])

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
