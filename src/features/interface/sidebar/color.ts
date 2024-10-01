import Tab from "../../../api/tab"
import PaletteIcon from "../../../assets/icons/palette.svg"
import ColorPanel from "./ColorPanel"

const Color: Tab = {
    place: "top",
    label: "Color",
    icon: PaletteIcon,
    contents: ColorPanel
}

export default Color