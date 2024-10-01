import { createContext, useContext } from 'solid-js'
import * as Y from 'yjs'

import { CanvasAction, VirtualCanvasAccess } from '../types/virtual_canvas'
import { doRectanglesIntersect } from '../util/rectangle'
import { DefaultRegistry } from './RegistryContext'
import { YjsContext } from './YjsContext'

export type VirtualCanvasState = {
  actions: Y.Array<CanvasAction>

  add: (action: CanvasAction) => void
  clear: () => void
  renderArea: (x: number, y: number, width: number, height: number, scale: number, options: ImageEncodeOptions) => Promise<Blob>

  replace: (oldAction: CanvasAction, newAction: CanvasAction) => void
}

export const DefaultCanvas: VirtualCanvasState = (() => {
  const yjs = useContext(YjsContext)

  const actions = yjs.ydoc.getArray<CanvasAction>('virtual-canvas-actions')

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
    const bounds = { height, width, x, y }

    const canvas = new OffscreenCanvas(width * scale, height * scale)
    const ctx = canvas.getContext('2d')!

    const access: VirtualCanvasAccess = {
      clearRect(x, y, width, height) {
        ctx.clearRect((x - bounds.x) * scale, (y - bounds.y) * scale, width * scale, height * scale)
      },
      get(x, y) {
        const imageData = ctx.getImageData((x - bounds.x) * scale, (y - bounds.y) * scale, 1, 1)
        return imageData.data[0]
      },
      getOrCreateContext() {
        return ctx
      },
      set(x, y, color) {
        ctx.fillStyle = color.toString()
        ctx.fillRect((x - bounds.x) * scale, (y - bounds.y) * scale, scale, scale)
      },
    }

    actions.forEach((action) => {
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
    clear,
    renderArea,
    replace,
  }
})()

export const VirtualCanvasContext = createContext(DefaultCanvas)

export default VirtualCanvasContext
