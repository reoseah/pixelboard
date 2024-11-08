import { createEffect, onCleanup, onMount, useContext } from 'solid-js'
import * as Y from 'yjs'

import RegistryContext from '../../state/RegistryContext'
import ViewportPositionContext from '../../state/ViewportPositionContext'
import VirtualCanvasContext from '../../state/VirtualCanvasContext'
import { RasterElement, RasterElementType, VirtualCanvasAccess } from '../../types/raster_elements.ts'
import { doRectanglesIntersect } from '../../util/rectangle'
import './VirtualCanvas.css'

const tileSize = 32

const VirtualCanvas = () => {
  const context = useContext(VirtualCanvasContext)
  const viewport = useContext(ViewportPositionContext)
  const { rasterElements: actionTypes } = useContext(RegistryContext)

  let containerRef!: HTMLDivElement

  const canvasRefs = new Map<number, Map<number, HTMLCanvasElement>>()
  const contexts = new Map<HTMLCanvasElement, CanvasRenderingContext2D>()

  const getOrCreateCanvas = (column: number, row: number): HTMLCanvasElement => {
    const existing = canvasRefs.get(column)?.get(row)
    if (existing) {
      return existing
    }

    const canvas = document.createElement('canvas')
    canvas.className = 'canvas-chunk'
    canvas.width = tileSize
    canvas.height = tileSize
    canvas.style.left = `${column * tileSize * viewport.scale()}px`
    canvas.style.top = `${row * tileSize * viewport.scale()}px`
    canvas.style.width = `${tileSize * viewport.scale()}px`
    canvas.style.height = `${tileSize * viewport.scale()}px`

    containerRef.appendChild(canvas)
    if (!canvasRefs.has(column)) {
      canvasRefs.set(column, new Map())
    }
    canvasRefs.get(column)!.set(row, canvas)

    return canvas
  }

  const getOrCreateContext = (column: number, row: number): CanvasRenderingContext2D => {
    const canvas = getOrCreateCanvas(column, row)
    if (contexts.has(canvas)) {
      return contexts.get(canvas)!
    }
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      throw new Error('could not get canvas context')
    }
    contexts.set(canvas, ctx)
    return ctx
  }

  const get = (x: number, y: number): number => {
    const ctx = getOrCreateContext(Math.floor(x / tileSize), Math.floor(y / tileSize))
    const localX = ((x % tileSize) + tileSize) % tileSize
    const localY = ((y % tileSize) + tileSize) % tileSize
    const imageData = ctx.getImageData(localX, localY, 1, 1)
    return imageData.data[0] << 24 | imageData.data[1] << 16 | imageData.data[2] << 8 | imageData.data[3]
  }

  const set = (x: number, y: number, rgba: number | string) => {
    const ctx = getOrCreateContext(Math.floor(x / tileSize), Math.floor(y / tileSize))
    const localX = ((x % tileSize) + tileSize) % tileSize
    const localY = ((y % tileSize) + tileSize) % tileSize
    if (typeof rgba === 'string') {
      ctx.fillStyle = rgba
    }
    else {
      ctx.fillStyle = rgba.toString(16)
    }
    ctx.fillRect(localX, localY, 1, 1)
  }

  const clearRect = (x: number, y: number, width: number, height: number) => {
    const minChunkX = Math.floor(x / tileSize)
    const minChunkY = Math.floor(y / tileSize)
    const maxChunkX = Math.ceil((x + width) / tileSize)
    const maxChunkY = Math.ceil((y + height) / tileSize)

    for (let column = minChunkX; column < maxChunkX; column++) {
      for (let row = minChunkY; row < maxChunkY; row++) {
        const ctx = getOrCreateContext(column, row)
        const localX = Math.max(0, x - column * tileSize)
        const localY = Math.max(0, y - row * tileSize)
        const localWidth = Math.min(tileSize, x + width - column * tileSize) - localX
        const localHeight = Math.min(tileSize, y + height - row * tileSize) - localY
        ctx.clearRect(localX, localY, localWidth, localHeight)
      }
    }
  }

  const access: VirtualCanvasAccess = {
    tileSize,
    getOrCreateContext,
    get,
    set,
    clearRect,
  }

  context.setRenderer(access)

  const createLimitedAccess = (type: 'blacklist' | 'whitelist', tiles: Map<number, Set<number>>): VirtualCanvasAccess => {
    const setInternal = access.set
    const set = (x: number, y: number, rgba: number | string) => {
      if (type === 'whitelist' && !containsPoint(x, y, tiles, tileSize)) {
        return
      }
      if (type === 'blacklist' && containsPoint(x, y, tiles, tileSize)) {
        return
      }
      setInternal(x, y, rgba)
    }
    return {
      ...access,
      allowList: { tiles, type },
      set,
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onDataChange = (event: Y.YEvent<Y.Array<any>>) => {
    if (isReplacementOfLastElement(event)) {
      const oldAction = event.changes.deleted.values().next().value!.content.getContent()[0]
      const newAction = event.changes.added.values().next().value!.content.getContent()[0]

      const type = actionTypes[newAction.type]
      if (type?.renderReplacement && type.renderReplacement(oldAction, newAction, access)) {
        return
      }
    }

    const deletionAffectedChunks = getChunksAffectedByDeletions(actionTypes, tileSize, event)
    if (deletionAffectedChunks.size !== 0) {
      const rerenderAccess = createLimitedAccess('whitelist', deletionAffectedChunks)

      deletionAffectedChunks.forEach((rows, column) => {
        rows.forEach((row) => {
          rerenderAccess
            .getOrCreateContext(column, row)
            .clearRect(0, 0, tileSize, tileSize)
        })
      })
      context.elements.forEach((action) => {
        const type = actionTypes[action.type]

        deletionAffectedChunks.forEach((rows, column) => {
          rows.forEach((row) => {
            if (affectsChunk(type, action, column, row, tileSize)) {
              type?.render(action, rerenderAccess)
            }
          })
        })
      })
    }
    const notRerenderedTilesAccess = createLimitedAccess('blacklist', deletionAffectedChunks)
    event.changes.added.forEach((item) => {
      item.content.getContent().forEach((action) => {
        const type = actionTypes[action.type]
        type?.render(action, notRerenderedTilesAccess)
      })
    })
  }
  onMount(() => {
    context.elements.observe(onDataChange)
  })
  onCleanup(() => {
    context.elements.unobserve(onDataChange)
  })

  createEffect(() => {
    const scale = viewport.scale()
    canvasRefs.forEach((rows, column) => {
      rows.forEach((canvas, row) => {
        canvas.style.left = `${column * tileSize * scale}px`
        canvas.style.top = `${row * tileSize * scale}px`
        canvas.style.width = `${tileSize * scale}px`
        canvas.style.height = `${tileSize * scale}px`
      })
    })
  })

  return (
    <div ref={ref => containerRef = ref} />
  )
}

export default VirtualCanvas

const affectsChunk = <T extends RasterElement = RasterElement>(type: RasterElementType<T>, action: T, column: number, row: number, tileSize: number) => {
  const actionBounds = type.getBounds(action)
  const chunkBounds = {
    x: column * tileSize,
    y: row * tileSize,
    height: tileSize - 1,
    width: tileSize - 1,
  }
  return doRectanglesIntersect(actionBounds, chunkBounds)
}

const getAffectedChunks = <T extends RasterElement = RasterElement>(type: RasterElementType<T>, action: T, tileSize: number) => {
  if (!type) {
    return []
  }
  const { height, width, x, y } = type.getBounds(action)
  const minChunkX = Math.floor(x / tileSize)
  const minChunkY = Math.floor(y / tileSize)
  const maxChunkX = Math.floor((x + width) / tileSize)
  const maxChunkY = Math.floor((y + height) / tileSize)
  const chunks = []
  for (let dx = minChunkX; dx <= maxChunkX; dx++) {
    for (let dy = minChunkY; dy <= maxChunkY; dy++) {
      chunks.push({ column: dx, row: dy })
    }
  }

  return chunks
}

const isReplacementOfLastElement = (event: Y.YEvent<Y.Array<unknown>>): boolean => {
  if (event.changes.delta.length <= 1 || event.changes.delta.length > 3) {
    return false
  }

  const last = event.changes.delta.at(-1)!
  const secondToLast = event.changes.delta.at(-2)!

  const lastIsInsert = last.insert !== undefined
  const lastIsDelete = last.delete !== undefined
  const secondToLastIsInsert = secondToLast.insert !== undefined
  const secondToLastIsDelete = secondToLast.delete !== undefined

  if ((lastIsInsert && secondToLastIsDelete)
    || (lastIsDelete && secondToLastIsInsert)) {
    if (event.changes.delta.length === 3) {
      const thirdToLastChange = event.changes.delta.at(0)!
      if (thirdToLastChange.retain === undefined) {
        return false
      }
    }
    return true
  }
  return false
}

const getChunksAffectedByDeletions = (actionTypes: Record<string, RasterElementType>, tileSize: number, event: Y.YEvent<Y.Array<RasterElement>>): Map<number, Set<number>> => {
  const chunks = new Map<number, Set<number>>()
  event.changes.deleted.forEach((item) => {
    item.content.getContent().forEach((action) => {
      getAffectedChunks(actionTypes[action.type], action, tileSize)
        .forEach((chunk) => {
          const { column, row } = chunk
          if (!chunks.has(column)) {
            chunks.set(column, new Set<number>())
          }
          chunks.get(column)!.add(row)
        })
    })
  })
  return chunks
}

const containsPoint = (x: number, y: number, chunks: Map<number, Set<number>>, chunkSize: number) => {
  const column = Math.floor(x / chunkSize)
  const row = Math.floor(y / chunkSize)
  return chunks.has(column) && chunks.get(column)!.has(row)
}
