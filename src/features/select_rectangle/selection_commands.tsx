import Command from "../../api/command_palette/command"
import { DefaultCanvas } from "../../api/canvas/VirtualCanvasContext"
import { VirtualCanvasSelection } from "../../api/canvas/CanvasSelectionContext"

export const Deselect: Command = {
    id: "deselect",
    label: () => "Deselect",
    isDisabled: () => {
        const selection = VirtualCanvasSelection
        return selection.parts.length === 0
    },
    execute: () => {
        const selection = VirtualCanvasSelection
        selection.deselect()
    }
}

export const Reselect: Command = {
    id: "reselect",
    label: () => "Reselect",
    isDisabled: () => {
        const selection = VirtualCanvasSelection
        return selection.prevParts().length === 0 || selection.parts.length !== 0
    },
    execute: () => {
        const selection = VirtualCanvasSelection
        selection.reselect()
    }
}

export const DeleteSelection: Command = {
    id: "delete_selection",
    label: () => "Delete",
    isDisabled: () => {
        const selection = VirtualCanvasSelection
        return selection.parts.length === 0
    },
    execute: () => {
        const canvas = DefaultCanvas
        const selection = VirtualCanvasSelection
        if (selection.parts.length === 1 && selection.parts[0].type === "rectangle") {
            canvas.add({
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