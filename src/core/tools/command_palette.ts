import Tool from "./tool"
import CommandIcon from "../../assets/icons/command.svg"
import CommandPalette from "../../components/features/tools/CommandPalette"

const createCommandPalette = (): Tool => {
    return {
        label: "Command Palette",
        icon: CommandIcon,
        subToolbar: CommandPalette
    }
}

export default createCommandPalette