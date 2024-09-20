import "./main_menu.css"
import MenuIcon from "../../assets/icons/menu.svg"
import Tab from "./tab"

const MainMenu: Tab = {
    place: "top",
    label: "Menu",
    icon: MenuIcon,
    contents: () => (
        <div class="main-menu">
            Main menu (WIP)
        </div>
    )
}

export default MainMenu