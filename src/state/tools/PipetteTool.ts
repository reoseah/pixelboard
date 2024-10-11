import { onCleanup, useContext } from 'solid-js'

import PipetteIcon from '../../assets/icons/pipette.svg'
import { isViewportClick, type Tool } from '../../types/tool'
import SelectedColorContext from '../SelectedColorContext'
import ViewportPositionContext from '../ViewportPositionContext'
import VirtualCanvasContext from '../VirtualCanvasContext'

const PipetteTool: Tool = {
  label: 'Pipette',
  icon: PipetteIcon,

  use: () => {
    const color = useContext(SelectedColorContext)
    const virtualCanvas = useContext(VirtualCanvasContext)
    const viewport = useContext(ViewportPositionContext)

    const handleMouseUp = (event: MouseEvent) => {
      if (!isViewportClick(event)) {
        return
      }

      const x = Math.floor(viewport.toCanvasX(event.clientX))
      const y = Math.floor(viewport.toCanvasY(event.clientY))
      color.setRgbaNumber(virtualCanvas.renderer().get(x, y))

      event.preventDefault()
    }

    document.addEventListener('mouseup', handleMouseUp)
    onCleanup(() => document.removeEventListener('mouseup', handleMouseUp))
  },
}

export default PipetteTool
