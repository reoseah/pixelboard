export type RasterElement = {
  [data: string]: unknown
  type: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RasterElementType<T extends RasterElement = any> = {
  getBounds: (element: T) => { height: number, width: number, x: number, y: number }

  render: (element: T, canvas: VirtualCanvasAccess) => void
  renderReplacement?: (previous: T, replacement: T, canvas: VirtualCanvasAccess) => boolean
}

export type VirtualCanvasAccess = {
  readonly tileSize?: number
  readonly allowList?: {
    tiles: Map<number, Set<number>>
    type: 'blacklist' | 'whitelist'
  }
  getOrCreateContext: (column: number, row: number) => CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D

  get: (x: number, y: number) => number
  set: (x: number, y: number, color: number | string) => void
  clearRect: (x: number, y: number, width: number, height: number) => void
}
