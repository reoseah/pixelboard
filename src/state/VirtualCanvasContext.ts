import { createContext, createMemo, useContext } from 'solid-js'
import * as Y from 'yjs'

import { CanvasAction, VirtualCanvasAccess } from '../types/virtual_canvas'
import { doRectanglesIntersect } from '../util/rectangle'
import RegistryContext, { Registry } from './RegistryContext'

export type VirtualCanvasState = {
  actions: Y.Array<CanvasAction>

  add: (action: CanvasAction) => void
  replace: (oldAction: CanvasAction, newAction: CanvasAction) => void
  clear: () => void
}

const VirtualCanvasContext = createContext<VirtualCanvasState>(undefined as unknown as VirtualCanvasState)

export default VirtualCanvasContext

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

  return {
    actions,
    add,
    replace,
    clear,
  }
}

export const useCanvasBounds = () => {
  const { actions } = useContext(VirtualCanvasContext)
  const { actionTypes } = useContext(RegistryContext)

  return createMemo(() => {
    let minX = Infinity
    let minY = Infinity
    let maxX = -Infinity
    let maxY = -Infinity
    actions.forEach((action) => {
      const type = actionTypes[action.type]
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
  })
}

export const renderArea = (virtualCanvas: VirtualCanvasState, actionTypes: Registry['actionTypes'], x: number, y: number, width: number, height: number, scale: number, options: ImageEncodeOptions): Promise<Blob> => {
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

  virtualCanvas.actions.forEach((action) => {
    const type = actionTypes[action.type]
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
