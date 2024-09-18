import Command from "./command"
import TrashCanIcon from "../../assets/icons/trash-can.svg"
import { VirtualCanvas } from "../../state/VirtualCanvas"

export const ClearProject: Command = {
    id: "clear_project",
    label: "Clear Project",
    icon: TrashCanIcon,
    execute: () => {
        const [, virtualCanvas] = VirtualCanvas

        virtualCanvas.clear()
    }
}