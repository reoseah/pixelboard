import { Component } from "solid-js"

export type Command = {
    id: string,
    label: string | (() => string)
    icon?: Component
    isDisabled?: () => boolean
    execute: () => void | Promise<void>
}