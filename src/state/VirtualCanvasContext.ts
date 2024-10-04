import { createContext } from 'solid-js'
import * as Y from 'yjs'

import { CanvasAction, VirtualCanvasAccess } from '../types/virtual_canvas'
import { doRectanglesIntersect } from '../util/rectangle'

export type VirtualCanvasState = {
  actions: Y.Array<CanvasAction>

  add: (action: CanvasAction) => void
  replace: (oldAction: CanvasAction, newAction: CanvasAction) => void
  clear: () => void

  getBounds: () => { x: number, y: number, width: number, height: number }
  renderArea: (x: number, y: number, width: number, height: number, scale: number, options: ImageEncodeOptions) => Promise<Blob>
}

export const createVirtualCanvasState = (ydoc: Y.Doc): VirtualCanvasState => {
  const actions = ydoc.getArray<CanvasAction>('virtual-canvas-actions')

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
    ydoc.transact(() => {
      actions.delete(idx)
      actions.insert(idx, [newAction])
    })
  }

  const clear = () => {
    ydoc.transact(() => {
      actions.delete(0, actions.length)
    })
  }

  const getBounds = () => {
    // FIXME: move this outside of the whiteboard context, it requires registry and so makes initializing state difficult
    // const registry = DefaultRegistry

    // let minX = Infinity
    // let minY = Infinity
    // let maxX = -Infinity
    // let maxY = -Infinity
    // actions.forEach((action) => {
    //   const type = registry.actionTypes[action.type]
    //   if (!type) {
    //     console.error(`Unknown action type ${action.type}`, action)
    //     return
    //   }
    //   const bounds = type.getBounds(action)
    //   minX = Math.min(minX, bounds.x)
    //   minY = Math.min(minY, bounds.y)
    //   maxX = Math.max(maxX, bounds.x + bounds.width)
    //   maxY = Math.max(maxY, bounds.y + bounds.height)
    // })
    // return { x: minX, y: minY, width: maxX - minX, height: maxY - minY }
    return { x: 0, y: 0, width: 0, height: 0 }
  }

  const renderArea = (x: number, y: number, width: number, height: number, scale: number, options: ImageEncodeOptions): Promise<Blob> => {
    // const registry = DefaultRegistry

    // const bounds = { height, width, x, y }

    // const canvas = new OffscreenCanvas(width * scale, height * scale)
    // const ctx = canvas.getContext('2d')!

    // const access: VirtualCanvasAccess = {
    //   clearRect(x, y, width, height) {
    //     ctx.clearRect((x - bounds.x) * scale, (y - bounds.y) * scale, width * scale, height * scale)
    //   },
    //   get(x, y) {
    //     const imageData = ctx.getImageData((x - bounds.x) * scale, (y - bounds.y) * scale, 1, 1)
    //     return imageData.data[0]
    //   },
    //   getOrCreateContext() {
    //     return ctx
    //   },
    //   set(x, y, color) {
    //     ctx.fillStyle = color.toString()
    //     ctx.fillRect((x - bounds.x) * scale, (y - bounds.y) * scale, scale, scale)
    //   },
    // }

    // actions.forEach((action) => {
    //   const type = registry.actionTypes[action.type]
    //   if (!type) {
    //     console.error(`Unknown action type ${action.type}`, action)
    //     return
    //   }
    //   const actionBounds = type.getBounds(action)
    //   if (doRectanglesIntersect(actionBounds, bounds)) {
    //     type.render(action, access)
    //   }
    // })

    // return canvas.convertToBlob(options)
    return null as unknown as Promise<Blob>
  }

  return {
    actions,
    add,
    replace,
    clear,
    getBounds,
    renderArea,
  }
}

export const VirtualCanvasContext = createContext<VirtualCanvasState>(undefined as unknown as VirtualCanvasState)

export default VirtualCanvasContext
