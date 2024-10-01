export type CanvasAction = {
  [data: string]: unknown
  type: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CanvasActionType<T extends CanvasAction = any> = {
  getBounds: (action: T) => { height: number, width: number, x: number, y: number }

  render: (action: T, canvas: VirtualCanvasAccess) => void
  renderReplacement?: (oldAction: T, newAction: T, canvas: VirtualCanvasAccess) => boolean
}

export type VirtualCanvasAccess = {
  readonly allowList?: {
    tiles: Map<number, Set<number>>
    type: 'blacklist' | 'whitelist'
  }
  clearRect: (x: number, y: number, width: number, height: number) => void
  get: (x: number, y: number) => number

  getOrCreateContext: (column: number, row: number) => CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D
  set: (x: number, y: number, color: number | string) => void
  readonly tileSize?: number
}
