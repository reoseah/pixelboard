import { Component } from 'solid-js'

export type Entity = {
  [data: string]: unknown
  type: string
}

export type EntityType<T extends Entity = Entity> = {
  getBounds: (element: T) => { height: number, width: number, x: number, y: number }
  render: Component<{ element: T, id: string }>
}
