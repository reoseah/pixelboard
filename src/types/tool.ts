import { Component } from 'solid-js'

export type Tool = {
  icon: Component
  label: string

  subToolbar?: Component
  use?: (() => undefined) & Component
  viewport?: Component
}

// TODO: move this to a more appropriate location
export const isViewportClick = (e: MouseEvent): boolean => {
  if (!(e.target as Element)?.closest) {
    return false
  }
  if (!(e.target as Element)?.closest('.viewport')) {
    return false
  }
  if ((e.target as Element)?.closest('.island')) {
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
