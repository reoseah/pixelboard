import { createContext } from 'solid-js'
import * as Y from 'yjs'

import type { Registry } from './RegistryContext'

import { RasterElement, VirtualCanvasAccess } from '../types/raster_elements.ts'
import { doRectanglesIntersect } from '../util/rectangle'

export type VirtualCanvasState = {
  elements: Y.Array<RasterElement>

  add: (element: RasterElement) => void
  replace: (previous: RasterElement, replacement: RasterElement) => void
  clear: () => void

  renderer: () => VirtualCanvasAccess
  setRenderer: (renderer: VirtualCanvasAccess) => void
}

const VirtualCanvasContext = createContext<VirtualCanvasState>(undefined as unknown as VirtualCanvasState)

export default VirtualCanvasContext

export const createVirtualCanvasState = (ydoc: Y.Doc): VirtualCanvasState => {
  const elements = ydoc.getArray<RasterElement>('raster-elements')

  const add = (action: RasterElement) => {
    elements.push([action])
  }

  const replace = (previous: RasterElement, replacement: RasterElement) => {
    let idx = -1
    for (let i = 0; i < elements.length; i++) {
      if (elements.get(i) === previous) {
        idx = i
        break
      }
    }
    if (idx === -1) {
      throw new Error('previous not found')
    }
    ydoc.transact(() => {
      elements.delete(idx)
      elements.insert(idx, [replacement])
    })
  }

  const clear = () => {
    ydoc.transact(() => {
      elements.delete(0, elements.length)
    })
  }

  let renderer: VirtualCanvasAccess | null = null

  const getRenderer = () => {
    return renderer!
  }

  const setRenderer = (newRenderer: VirtualCanvasAccess) => {
    renderer = newRenderer
  }

  return {
    elements,
    add,
    replace,
    clear,
    renderer: getRenderer,
    setRenderer,
  }
}

export const getCanvasBounds = (canvas: VirtualCanvasState, registry: Registry['rasterElements']) => {
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  canvas.elements.forEach((action) => {
    const type = registry[action.type]
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

export const renderArea = (virtualCanvas: VirtualCanvasState, actionTypes: Registry['rasterElements'], x: number, y: number, width: number, height: number, scale: number): OffscreenCanvas => {
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

  virtualCanvas.elements.forEach((action) => {
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

  return canvas
}
