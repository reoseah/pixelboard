import './VirtualCanvasComponent.css'
import * as Y from "yjs"
import { createEffect, onCleanup, onMount, useContext } from 'solid-js'
import { RegistryContext } from '../state/Registry'
import { VirtualCanvasContext } from '../state/VirtualCanvas'
import { ViewportPositionContext } from '../state/ViewportPosition'
import { CanvasAction, CanvasActionType, VirtualCanvasAccess } from '../core/canvas_actions/canvas_action'

const tileSize = 32

const VirtualCanvasComponent = () => {
    const [state, actions] = useContext(VirtualCanvasContext)
    const [viewport] = useContext(ViewportPositionContext)
    const { actionTypes } = useContext(RegistryContext)

    let containerRef!: HTMLDivElement

    let canvasRefs = new Map<number, Map<number, HTMLCanvasElement>>()
    let contexts = new Map<HTMLCanvasElement, CanvasRenderingContext2D>()

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

    const set = (x: number, y: number, rgba: number) => {
        const ctx = getOrCreateContext(Math.floor(x / tileSize), Math.floor(y / tileSize))
        const localX = ((x % tileSize) + tileSize) % tileSize
        const localY = ((y % tileSize) + tileSize) % tileSize
        ctx.fillStyle = `rgba(${(rgba >> 24) & 0xff}, ${(rgba >> 16) & 0xff}, ${(rgba >> 8) & 0xff}, ${rgba & 0xff})`
        ctx.fillRect(localX, localY, 1, 1)
    }

    const access: VirtualCanvasAccess = {
        tileSize,
        getOrCreateContext,
        get,
        set
    }

    const createLimitedAccess = (type: "blacklist" | "whitelist", tiles: Map<number, Set<number>>): VirtualCanvasAccess => {
        const setInternal = access.set
        const set = (x: number, y: number, rgba: number) => {
            if (type === "whitelist" && !containsPoint(x, y, tiles, tileSize)) {
                return
            }
            if (type === "blacklist" && containsPoint(x, y, tiles, tileSize)) {
                return
            }
            setInternal(x, y, rgba)
        }
        return {
            ...access,
            allowList: { type, tiles },
            set
        }
    }

    const onDataChange = (event: Y.YEvent<Y.Array<CanvasAction>>) => {
        if (isReplacementOfLastElement(event)) {
            const oldAction = event.changes.deleted.values().next().value.content.getContent()[0]
            const newAction = event.changes.added.values().next().value.content.getContent()[0]

            const type = actionTypes[newAction.type]
            if (type?.renderReplacement && type.renderReplacement(oldAction, newAction, access)) {
                return
            }
        }

        const deletionAffectedChunks = getChunksAffectedByDeletions(actionTypes, tileSize, event)
        if (deletionAffectedChunks.size !== 0) {
            const rerenderAccess = createLimitedAccess("whitelist", deletionAffectedChunks)

            deletionAffectedChunks.forEach((rows, column) => {
                rows.forEach((row) => {
                    rerenderAccess
                        .getOrCreateContext(column * tileSize, row * tileSize)
                        .clearRect(0, 0, 64, 64)
                })
            })
            state.actions.forEach((action) => {
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
        const notRerenderedTilesAccess = createLimitedAccess("blacklist", deletionAffectedChunks)
        event.changes.added.forEach((item) => {
            item.content.getContent().forEach((action) => {
                const type = actionTypes[action.type]
                type?.render(action, notRerenderedTilesAccess)
            })
        })
    }
    onMount(() => {
        state.actions.observe(onDataChange)
    })
    onCleanup(() => {
        state.actions.unobserve(onDataChange)
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
        <div ref={ref => containerRef = ref}></div>
    )
}

export default VirtualCanvasComponent

const affectsChunk = <T extends CanvasAction = any,>(type: CanvasActionType<T>, action: T, column: number, row: number, tileSize: number) => {
    const actionBounds = type.getBounds(action)
    const chunkBounds = {
        x: column * tileSize,
        y: row * tileSize,
        width: tileSize - 1,
        height: tileSize - 1
    }
    return doRectanglesIntersect(actionBounds, chunkBounds)
}

const doRectanglesIntersect = (
    a: { x: number, y: number, width: number, height: number },
    b: { x: number, y: number, width: number, height: number }
) => {
    return a.x < b.x + b.width
        && a.x + a.width > b.x
        && a.y < b.y + b.height
        && a.y + a.height > b.y
}

const getAffectedChunks = <T extends CanvasAction = any,>(type: CanvasActionType<T>, action: T, tileSize: number) => {
    if (!type) {
        return []
    }
    const { x, y, width, height } = type.getBounds(action)
    const chunks = []
    for (let dx = 0; dx <= width; dx += tileSize) {
        for (let dy = 0; dy <= height; dy += tileSize) {
            chunks.push({ column: Math.floor((y + dx) / tileSize), row: Math.floor((x + dy) / tileSize) })
        }
    }
    return chunks
}

const isReplacementOfLastElement = (event: Y.YEvent<Y.Array<any>>): boolean => {
    if (event.changes.delta.length <= 1 || event.changes.delta.length > 3) {
        return false
    }

    const last = event.changes.delta.at(-1)!
    const secondToLast = event.changes.delta.at(-2)!
    if (last.delete === undefined || secondToLast.insert === undefined) {
        console.log(event.changes.delta)
        return false
    }
    if ((last.delete !== 1 || secondToLast.insert!.length !== 1)
        && (last.insert!.length !== 1 || secondToLast.delete !== 1)) {
        console.log(last.delete, secondToLast.insert, last.insert, secondToLast.delete)
        return false
    }
    if (event.changes.delta.length === 3) {
        const thirdToLastChange = event.changes.delta.at(0)!
        if (thirdToLastChange.retain === undefined) {
            return false
        }
    }
    return true
}

const getChunksAffectedByDeletions = (actionTypes: Record<string, CanvasActionType>, tileSize: number, event: Y.YEvent<Y.Array<CanvasAction>>): Map<number, Set<number>> => {
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