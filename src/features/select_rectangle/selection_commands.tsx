import Command from "../../api/command"
import { VirtualCanvas } from "../../api/VirtualCanvas"
import Selection from "../../api/Selection"

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

export const DeleteSelection: Command = {
    id: "delete_selection",
    label: () => "Delete",
    isDisabled: () => {
        const [selection] = Selection
        return selection.parts.length === 0
    },
    execute: () => {
        const [, canvasActions] = VirtualCanvas
        const [selection] = Selection
        if (selection.parts.length === 1 && selection.parts[0].type === "rectangle") {
            canvasActions.add({
                type: "delete_rectangle",
                x: selection.parts[0].x,
                y: selection.parts[0].y,
                width: selection.parts[0].width,
                height: selection.parts[0].height
            })
        }
        // TODO  
    }
}