import Tab from "./tab"
import MenuIcon from "../../assets/icons/menu.svg"
import Stack from "../../components/ui/Stack"

const MainMenu: Tab = {
    place: "top",
    label: "Menu",
    icon: MenuIcon,
    contents: () => (
        <Stack spacing={.75} padding={.75}>
            Main menu (work in progress)
        </Stack>
    )
}

export default MainMenu