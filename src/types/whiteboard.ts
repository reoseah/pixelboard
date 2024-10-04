import { Component } from 'solid-js'

export type WhiteboardElement = {
  [data: string]: unknown
  type: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WhiteboardElementType<T extends WhiteboardElement = any> = {
  render: Component<{ element: T, id: string }>
  getBounds: (element: T) => { height: number, width: number, x: number, y: number }
}
