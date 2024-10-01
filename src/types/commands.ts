import { Component } from 'solid-js'

export type Command = {
  execute: () => Promise<void> | void
  icon?: Component
  id: string
  isDisabled?: () => boolean
  label: (() => string) | string
}
