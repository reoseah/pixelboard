import CommandIcon from "../../assets/icons/command.svg"
import { Tool } from "./tool"

const createCommandPalette = (): Tool => {
    return {
        title: "Actions",
        icon: CommandIcon,
        key: "Ctrl+P"
    }
}

export default createCommandPalette