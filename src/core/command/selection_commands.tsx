import Command from "./command"
import Selection from "../../state/Selection"

export const Deselect: Command = {
    id: "deselect",
    label: () => "Deselect",
    isDisabled: () => {
        const [selection] = Selection
        return selection.parts.length === 0
    },
    execute: () => {
        const [, actions] = Selection
        actions.deselect()
    }
}

export const Reselect: Command = {
    id: "reselect",
    label: () => "Reselect",
    isDisabled: () => {
        const [selection] = Selection
        return selection.prevParts().length === 0 || selection.parts.length !== 0
    },
    execute: () => {
        const [, actions] = Selection
        actions.reselect()
    }
}