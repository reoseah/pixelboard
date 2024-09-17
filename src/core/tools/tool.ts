import { Component } from "solid-js"

export type Tool = {
    title: string
    key: string
    icon: Component
    subToolbar?: Component
    viewportContent?: Component
    onSelect?: () => void
    onDeselect?: () => void
}