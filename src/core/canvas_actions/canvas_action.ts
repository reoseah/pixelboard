export type CanvasAction = {
    type: string,
    [data: string]: unknown
}

export type CanvasActionType<T extends CanvasAction = any> = {
    getBounds: (action: T) => { x: number, y: number, width: number, height: number }

    render: (action: T, canvas: VirtualCanvasAccess) => void
    renderReplacement?: (oldAction: T, newAction: T, canvas: VirtualCanvasAccess) => boolean
}

export type VirtualCanvasAccess = {
    readonly tileSize: number
    readonly allowList?: {
        type: "blacklist" | "whitelist"
        tiles: Map<number, Set<number>>
    }
    getOrCreateContext: (column: number, row: number) => CanvasRenderingContext2D

    get: (x: number, y: number) => number
    set: (x: number, y: number, color: number | string) => void
    clearRect: (x: number, y: number, width: number, height: number) => void
}