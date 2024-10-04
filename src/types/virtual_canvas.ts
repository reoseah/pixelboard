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

// For simplicity, only simple rectangle selections are supported.
// Arbitrary selections like needed for Magic Wand tool
// might be quite hard to implement, especially with infinite canvas
// and there are more critical features to do first.
export type SelectionPart =
  | { height: number, type: 'rectangle', width: number, x: number, y: number }

// not `SelectionMode` to avoid collision with built-in type
export type SelectionToolMode =
  | 'replace'
