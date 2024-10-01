import { Tab } from "../../../types/sidebar"
import MenuIcon from "../../../assets/icons/menu.svg"
import MainMenuPanel from "./MainMenuPanel"

const MainMenu: Tab = {
    place: "top",
    label: "Menu",
    icon: MenuIcon,
    contents: MainMenuPanel
}

export default MainMenu