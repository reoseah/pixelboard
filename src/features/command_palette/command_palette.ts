import Tool from "../../api/tool"
import CommandIcon from "../../assets/icons/command.svg"
import CommandPalette from "./CommandPalette"

const createCommandPalette = (): Tool => {
    return {
        label: "Command Palette",
        icon: CommandIcon,
        subToolbar: CommandPalette
    }
}

export default createCommandPalette