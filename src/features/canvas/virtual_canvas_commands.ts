import { BoardElements } from "../../api/BoardElements"
import Command from "../../api/command"
import { VirtualCanvas } from "../../api/VirtualCanvas"
import TrashCanIcon from "../../assets/icons/trash-can.svg"

export const ClearProject: Command = {
    id: "clear_project",
    label: "Clear Project",
    icon: TrashCanIcon,
    execute: () => {
        const [, virtualCanvas] = VirtualCanvas
        const [, elements] = BoardElements
        elements.clear()
        virtualCanvas.clear()
    }
}