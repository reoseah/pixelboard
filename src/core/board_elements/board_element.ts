import { Component } from "solid-js"

type BoardElement = {
    type: string
    [data: string]: unknown
}

export default BoardElement

export type BoardElementType<T extends BoardElement = any> = {
    render: Component<{ id: string, element: T }>
}