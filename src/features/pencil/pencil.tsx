import { createSignal, onCleanup, useContext } from 'solid-js'

import PencilIcon from '../../assets/icons/pencil.svg'
import { CurrentColorContext } from '../../state/CurrentColorContext'
import { ViewportPositionContext } from '../../state/ViewportPositionContext'
import { VirtualCanvasContext } from '../../state/VirtualCanvasContext'
import { isViewportClick, Tool } from '../../types/tool'
import { normalizeHex } from '../../util/color_conversion'
import { PencilStroke } from './pencil_stroke'
import { PencilContext } from './PencilContext'
import PencilToolbar from './PencilToolbar'

const createPencil = (): Tool => {
  return {
    icon: PencilIcon,
    label: 'Pencil',
    subToolbar: PencilToolbar,
    use: () => {
      const viewport = useContext(ViewportPositionContext)
      const canvas = useContext(VirtualCanvasContext)

      const [lastMousePos, setLastMousePos] = createSignal<{ x: number, y: number }>({ x: 0, y: 0 })
      let currentAction: null | PencilStroke = null

      const color = useContext(CurrentColorContext)
      const { shape, size } = useContext(PencilContext)

      const handleMouseDown = (e: MouseEvent) => {
        if (!isViewportClick(e)) {
          return
        }

        e.preventDefault()

        const pos = {
          x: Math.floor(viewport.toCanvasX(e.clientX)),
          y: Math.floor(viewport.toCanvasY(e.clientY)),
        }
        setLastMousePos(pos)
        const action: PencilStroke = {
          color: normalizeHex(color.hex()),
          points: [pos],
          shape: shape(),
          size: size(),
          type: 'pencil_stroke',
        }
        canvas.add(action)
        currentAction = action

        // TODO: draw straight lines when shift is pressed
      }

      const handleMouseMove = (e: MouseEvent) => {
        if (currentAction) {
          const newX = Math.floor(viewport.toCanvasX(e.clientX))
          const newY = Math.floor(viewport.toCanvasY(e.clientY))

          if (newX === lastMousePos().x && newY === lastMousePos().y) {
            return
          }

          const newAction: PencilStroke = {
            ...currentAction,
            points: [...currentAction.points, { x: newX, y: newY }],
          }
          canvas.replace(currentAction, newAction)
          currentAction = newAction

          setLastMousePos({ x: newX, y: newY })
        }
      }

      const handleMouseUp = (e: MouseEvent) => {
        if (!isViewportClick(e)) {
          return
        }
        currentAction = null
      }

      document.addEventListener('mousedown', handleMouseDown)
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)

      onCleanup(() => {
        document.removeEventListener('mousedown', handleMouseDown)
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        currentAction = null
      })
    },
  }
}

export default createPencil
