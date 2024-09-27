import Tab from "./tab"
import MainMenuPanel from "../../components/features/sidebar/MainMenuPanel"
import MenuIcon from "../../assets/icons/menu.svg"

const MainMenu: Tab = {
    place: "top",
    label: "Menu",
    icon: MenuIcon,
    contents: MainMenuPanel
}

export default MainMenu