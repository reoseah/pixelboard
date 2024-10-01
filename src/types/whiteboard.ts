import { Component } from 'solid-js'

export type Entity = {
  [data: string]: unknown
  type: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type EntityType<T extends Entity = any> = {
  getBounds: (element: T) => { height: number, width: number, x: number, y: number }
  render: Component<{ element: T, id: string }>
}
