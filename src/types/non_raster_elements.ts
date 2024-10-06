import { Component } from 'solid-js'

// consider naming it NonRasterElement?
export type NonRasterElement = {
  [data: string]: unknown
  type: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type NonRasterElementType<T extends NonRasterElement = any> = {
  render: Component<{ element: T, id: string }>
  getBounds: (element: T) => { height: number, width: number, x: number, y: number }
  move?: (element: T, dx: number, dy: number) => T
  finishMove?: (element: T) => T
}
