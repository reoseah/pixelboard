import { Component } from "solid-js"

type Command = {
    id: string,
    label: string | (() => string)
    icon?: Component
    isDisabled?: () => boolean
    execute: () => void | Promise<void>
}

export default Command