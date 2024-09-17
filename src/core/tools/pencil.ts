import { useContext } from 'solid-js'
import PencilIcon from '../../assets/icon/pencil.svg'
import { Tool } from './tool'
import { ViewportPositionContext } from '../../state/ViewportPosition'
import { PencilStroke } from '../canvas_actions/pencil_stroke'
import { VirtualCanvasContext } from '../../state/VirtualCanvas'

export const createPencil = (): Tool => {
    const [viewport, viewportActions] = useContext(ViewportPositionContext)
    const [virtualCanvas, virtualCanvasActions] = useContext(VirtualCanvasContext)

    const handleMouseDown = (event: MouseEvent) => {
        // TODO: Implement

        virtualCanvasActions.add({
            type: "pencil_stroke",
            points: [{
                x: Math.floor(viewportActions.toCanvasX(event.clientX)),
                y: Math.floor(viewportActions.toCanvasY(event.clientY))
            }],
            shape: "circle",
            size: 5
        })
    }
    return {
        title: "Pencil",
        key: "B",
        icon: PencilIcon,
        onSelect: () => {
            document.addEventListener("mousedown", handleMouseDown)
        },
        onDeselect: () => {
            document.removeEventListener("mousedown", handleMouseDown)
        }
    }
}
