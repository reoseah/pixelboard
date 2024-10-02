import { createContext, createRoot, useContext } from 'solid-js'
import * as Y from 'yjs'

import { CanvasAction, VirtualCanvasAccess } from '../types/virtual_canvas'
import { doRectanglesIntersect } from '../util/rectangle'
import RegistryContext from './RegistryContext'
import { YjsContext } from './YjsContext'

export type VirtualCanvasState = {
  actions: Y.Array<CanvasAction>

  add: (action: CanvasAction) => void
  replace: (oldAction: CanvasAction, newAction: CanvasAction) => void
  clear: () => void

  getBounds: () => { x: number; y: number; width: number; height: number }
  renderArea: (x: number, y: number, width: number, height: number, scale: number, options: ImageEncodeOptions) => Promise<Blob>
}

export const DefaultCanvas: VirtualCanvasState = createRoot(() => {
  const yjs = useContext(YjsContext)
  const registry = useContext(RegistryContext)

  const actions = yjs.ydoc().getArray<CanvasAction>('virtual-canvas-actions')

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
    yjs.ydoc().transact(() => {
      actions.delete(idx)
      actions.insert(idx, [newAction])
    })
  }

  const clear = () => {
    yjs.ydoc().transact(() => {
      actions.delete(0, actions.length)
    })
  }

  const getBounds = () => {
    let minX = Infinity
    let minY = Infinity
    let maxX = -Infinity
    let maxY = -Infinity
    actions.forEach((action) => {
      const type = registry.actionTypes[action.type]
      if (!type) {
        console.error(`Unknown action type ${action.type}`, action)
        return
      }
      const bounds = type.getBounds(action)
      minX = Math.min(minX, bounds.x)
      minY = Math.min(minY, bounds.y)
      maxX = Math.max(maxX, bounds.x + bounds.width)
      maxY = Math.max(maxY, bounds.y + bounds.height)
    })
    return { x: minX, y: minY, width: maxX - minX, height: maxY - minY }
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
      const type = registry.actionTypes[action.type]
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
    getBounds,
    renderArea,
  }
})

export const VirtualCanvasContext = createContext(DefaultCanvas)

export default VirtualCanvasContext
