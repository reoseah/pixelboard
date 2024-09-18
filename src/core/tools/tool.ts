import { Component } from "solid-js"

export type Tool = {
    label: string
    icon: Component
    subToolbar?: Component
    viewportContent?: Component
    onSelect?: (prev: string) => void
    onDeselect?: () => void
}

export const isViewportClick = (e: MouseEvent): boolean => {
    if (!(e.target as Element)?.closest(".viewport")) {
        return false
    }
    if (e.button !== 0) {
        return false
    }
    const target = e.target as HTMLElement
    const isEditable = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable
    if (isEditable) {
        return false
    }
    return true
}
