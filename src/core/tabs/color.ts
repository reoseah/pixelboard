import Tab from "./tab"
import PaletteIcon from "../../assets/icons/palette.svg"
import ColorPanel from "../../components/features/sidebar/ColorPanel"

const Color: Tab = {
    place: "top",
    label: "Color",
    icon: PaletteIcon,
    contents: ColorPanel
}

export default Color