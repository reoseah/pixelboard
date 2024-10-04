import { Component } from 'solid-js'

export type Command = {
  id: string
  label: (() => string) | string
  isDisabled?: () => boolean
  icon?: Component
  execute: () => Promise<void> | void
}
