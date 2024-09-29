import Command from "./command"
import { VirtualCanvas } from "../../state/VirtualCanvas"
import { BoardElements } from "../../state/BoardElements"
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