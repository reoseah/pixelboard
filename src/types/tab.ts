import { Component } from 'solid-js'

export type Tab = {
  contents: Component
  icon: Component
  label: string
  place: 'bottom' | 'top'
}
