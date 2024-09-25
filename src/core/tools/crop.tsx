import { onCleanup, useContext } from 'solid-js'
import CropIcon from '../../assets/icons/crop.svg'
import Tool from './tool'
import { ViewportPositionContext } from '../../state/ViewportPosition'
import { SharedRectangleStateContext } from '../../state/RectangleToolsState'
import CropPreview from '../../components/features/tools/CropPreview'

const createCrop = (): Tool => {
    return {
        label: "Frame/Crop",
        icon: CropIcon,
        viewport: CropPreview,
        use: () => {
            const [, viewport] = useContext(ViewportPositionContext)
            const {
                setInitialPos,
                setCurrentPos,
                dragging,
                setDragging
            } = useContext(SharedRectangleStateContext)

            const handleMouseDown = (e: MouseEvent) => {
                if (e.button !== 0) {
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

                setDragging(false)
                setInitialPos({ x: 0, y: 0 })
                setCurrentPos({ x: 0, y: 0 })
            }

            document.addEventListener("mousedown", handleMouseDown)
            document.addEventListener("mousemove", handleMouseMove)
            document.addEventListener("mouseup", handleMouseUp)

            onCleanup(() => {
                document.removeEventListener("mousedown", handleMouseDown)
                document.removeEventListener("mousemove", handleMouseMove)
                document.removeEventListener("mouseup", handleMouseUp)
                // setDragging(false)
                // setInitialPos({ x: 0, y: 0 })
                // setCurrentPos({ x: 0, y: 0 })
            })
        }
    }
}

export default createCrop