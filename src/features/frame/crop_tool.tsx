import { onCleanup, useContext } from 'solid-js'
import CropIcon from '../../assets/icons/crop.svg'
import WhiteboardContext from '../../state/WhiteboardContext'
import { CurrentToolContext } from '../../state/CurrentToolContext'
import { RectangleDragContext } from '../../state/RectangleDragContext'
import { Tool, isViewportClick } from '../../types/tools'
import { ViewportPositionContext } from '../../state/ViewportPositionContext'
import CropPreview from './CropPreview'

const createCrop = (): Tool => {
    return {
        label: "Crop/Frame",
        icon: CropIcon,
        viewport: CropPreview,
        use: () => {
            const viewport = useContext(ViewportPositionContext)
            const whiteboard = useContext(WhiteboardContext)
            const currentTool = useContext(CurrentToolContext)

            const {
                initialPos,
                setInitialPos,
                currentPos,
                setCurrentPos,
                dragging,
                setDragging
            } = useContext(RectangleDragContext)

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
                const width = Math.round(Math.abs(currentPos().x - initialPos().x))
                const height = Math.round(Math.abs(currentPos().y - initialPos().y))

                if (width > 0 && height > 0) {
                    whiteboard.set(crypto.randomUUID(), {
                        type: "crop",
                        x,
                        y,
                        width,
                        height
                    })
                }

                setDragging(false)
                setInitialPos({ x: 0, y: 0 })
                setCurrentPos({ x: 0, y: 0 })
                currentTool.selectId("select")
            }

            const handleKeyDown = (e: KeyboardEvent) => {
                if (e.key === "Escape") {
                    setDragging(false)
                    setInitialPos({ x: 0, y: 0 })
                    setCurrentPos({ x: 0, y: 0 })
                }
            }

            document.addEventListener("mousedown", handleMouseDown)
            document.addEventListener("mousemove", handleMouseMove)
            document.addEventListener("mouseup", handleMouseUp)
            document.addEventListener("keydown", handleKeyDown)

            onCleanup(() => {
                document.removeEventListener("mousedown", handleMouseDown)
                document.removeEventListener("mousemove", handleMouseMove)
                document.removeEventListener("mouseup", handleMouseUp)
                document.removeEventListener("keydown", handleKeyDown)
            })
        }
    }
}

export default createCrop