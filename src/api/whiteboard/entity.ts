import { Component } from "solid-js"

export type Entity = {
    type: string
    [data: string]: unknown
}

export type EntityType<T extends Entity = any> = {
    render: Component<{ id: string, element: T }>
    getBounds: (element: T) => { x: number, y: number, width: number, height: number }
}