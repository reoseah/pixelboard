import { Tool } from "./tool"
import SelectionIcon from "../../assets/icon/selection.svg"

const createSelectRectangle = (): Tool => {
    return {
        title: "Select Rectangle",
        icon: SelectionIcon,
        key: "M"
    }
}

export default createSelectRectangle