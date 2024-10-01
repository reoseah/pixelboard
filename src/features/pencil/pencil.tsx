import { createSignal, onCleanup, useContext } from 'solid-js'
import { CurrentColorContext } from '../../api/CurrentColor'
import { PencilStateContext } from '../../api/PencilState'
import Tool, { isViewportClick } from '../../api/tool'
import { ViewportPositionContext } from '../../api/ViewportPosition'
import { VirtualCanvasContext } from '../../api/VirtualCanvas'
import { normalizeHex } from '../../util/color_conversion'
import { PencilStroke } from './pencil_stroke'
import PencilToolbar from './PencilToolbar'
import PencilIcon from '../../assets/icons/pencil.svg'

const createPencil = (): Tool => {
    return {
        label: "Pencil",
        icon: PencilIcon,
        subToolbar: PencilToolbar,
        use: () => {
            const [, viewportActions] = useContext(ViewportPositionContext)
            const [, virtualCanvasActions] = useContext(VirtualCanvasContext)

            const [lastMousePos, setLastMousePos] = createSignal<{ x: number, y: number }>({ x: 0, y: 0 })
            let currentAction: PencilStroke | null = null

            const color = useContext(CurrentColorContext)
            const { shape, size, } = useContext(PencilStateContext)

            const handleMouseDown = (e: MouseEvent) => {
                if (!isViewportClick(e)) {
                    return
                }

                e.preventDefault()

                const pos = {
                    x: Math.floor(viewportActions.toCanvasX(e.clientX)),
                    y: Math.floor(viewportActions.toCanvasY(e.clientY))
                }
                setLastMousePos(pos)
                const action: PencilStroke = {
                    type: "pencil_stroke",
                    points: [pos],
                    shape: shape(),
                    size: size(),
                    color: normalizeHex(color.hex()),
                }
                virtualCanvasActions.add(action)
                currentAction = action

                // TODO: draw straight lines when shift is pressed
            }

            const handleMouseMove = (e: MouseEvent) => {
                if (currentAction) {
                    let newX = Math.floor(viewportActions.toCanvasX(e.clientX))
                    let newY = Math.floor(viewportActions.toCanvasY(e.clientY))

                    if (newX === lastMousePos().x && newY === lastMousePos().y) {
                        return
                    }

                    const newAction: PencilStroke = {
                        ...currentAction,
                        points: [...currentAction.points, { x: newX, y: newY }]
                    }
                    virtualCanvasActions.replace(currentAction, newAction)
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

            document.addEventListener("mousedown", handleMouseDown)
            document.addEventListener("mousemove", handleMouseMove)
            document.addEventListener("mouseup", handleMouseUp)

            onCleanup(() => {
                document.removeEventListener("mousedown", handleMouseDown)
                document.removeEventListener("mousemove", handleMouseMove)
                document.removeEventListener("mouseup", handleMouseUp)
                currentAction = null
            })
        }
    }
}

export default createPencil
