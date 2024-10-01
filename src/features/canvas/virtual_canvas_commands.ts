import { DefaultWhiteboard } from "../../api/whiteboard/WhiteboardContext"
import Command from "../../api/command"
import { DefaultCanvas } from "../../api/canvas/VirtualCanvasContext"
import TrashCanIcon from "../../assets/icons/trash-can.svg"

// TODO: this does not belong here, should be in some `project_commands` file
export const ClearProject: Command = {
    id: "clear_project",
    label: "Clear Project",
    icon: TrashCanIcon,
    execute: () => {
        const canvas = DefaultCanvas
        const whiteboard = DefaultWhiteboard
        canvas.clear()
        whiteboard.clear()
    }
}