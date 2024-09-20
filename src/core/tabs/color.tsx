import "./color.css"
import Tab from "./tab"
import PaletteIcon from "../../assets/icons/palette.svg"

const Color: Tab = {
    place: "top",
    label: "Color",
    icon: PaletteIcon,
    contents: () => {
        return (
            <div class="color-tab">
                Color selection and palette (WIP)
            </div>
        )
    }
}

export default Color