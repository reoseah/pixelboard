import * as Y from 'yjs'
import { createContext, useContext } from 'solid-js'
import { YjsContext } from '../Yjs'
import DefaultRegistry from '../RegistryContext'
import { doRectanglesIntersect } from '../../util/rectangle'
import { CanvasAction, VirtualCanvasAccess } from './canvas_action'

export type VirtualCanvasState = {
    actions: Y.Array<CanvasAction>

    add: (action: CanvasAction) => void
    replace: (oldAction: CanvasAction, newAction: CanvasAction) => void
    clear: () => void

    renderArea: (x: number, y: number, width: number, height: number, scale: number, options: ImageEncodeOptions) => Promise<Blob>
}

export const DefaultCanvas: VirtualCanvasState = (() => {
    const [yjs] = useContext(YjsContext)

    const actions = yjs.ydoc.getArray<CanvasAction>("virtual-canvas-actions")

    const add = (action: CanvasAction) => {
        actions.push([action])
    }

    const replace = (oldAction: CanvasAction, newAction: CanvasAction) => {
        let idx = -1
        for (let i = 0; i < actions.length; i++) {
            if (actions.get(i) === oldAction) {
                idx = i
                break
            }
        }
        if (idx === -1) {
            throw new Error('oldAction not found')
        }
        yjs.ydoc.transact(() => {
            actions.delete(idx)
            actions.insert(idx, [newAction])
        })
    }

    const clear = () => {
        yjs.ydoc.transact(() => {
            actions.delete(0, actions.length)
        })
    }

    const renderArea = (x: number, y: number, width: number, height: number, scale: number, options: ImageEncodeOptions): Promise<Blob> => {
        const bounds = { x, y, width, height }

        const canvas = new OffscreenCanvas(width * scale, height * scale)
        const ctx = canvas.getContext('2d')!

        const access: VirtualCanvasAccess = {
            getOrCreateContext() {
                return ctx;
            },
            get(x, y) {
                const imageData = ctx.getImageData((x - bounds.x) * scale, (y - bounds.y) * scale, 1, 1)
                return imageData.data[0]
            },
            set(x, y, color) {
                ctx.fillStyle = color.toString()
                ctx.fillRect((x - bounds.x) * scale, (y - bounds.y) * scale, scale, scale)
            },
            clearRect(x, y, width, height) {
                ctx.clearRect((x - bounds.x) * scale, (y - bounds.y) * scale, width * scale, height * scale)
            }
        }

        actions.forEach(action => {
            const type = DefaultRegistry.actionTypes[action.type]
            if (!type) {
                console.error(`Unknown action type ${action.type}`, action)
                return
            }
            const actionBounds = type.getBounds(action)
            if (doRectanglesIntersect(actionBounds, bounds)) {
                type.render(action, access)
            }
        })

        return canvas.convertToBlob(options)
    }

    return {
        actions,
        add,
        replace,
        clear,
        renderArea
    }
})()

export const VirtualCanvasContext = createContext(DefaultCanvas)

export default VirtualCanvasContext
