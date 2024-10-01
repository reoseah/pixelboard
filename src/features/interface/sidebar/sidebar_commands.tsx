import Command from "../../../api/command_palette/command"
import Registry from "../../../api/RegistryContext"
import Sidebar from "../../../api/sidebar/SidebarContext"
import SidebarIcon from "../../../assets/icons/sidebar.svg"

export const ToggleSidebar: Command = {
    id: "toggle_sidebar",
    icon: SidebarIcon,
    label: () => "Toggle Sidebar",
    isDisabled: () => false,
    execute: () => {
        const sidebar = Sidebar
        sidebar.toggle()
    }
}

export const createTabCommand = (tab: string): Command => ({
    id: `toggle_tab.${tab}`,
    icon: () => Registry.tabs[tab].icon({}),
    label: () => {
        const { tabs } = Registry
        return `Toggle ${tabs[tab].label} Tab`
    },
    isDisabled: () => false,
    execute: () => {
        const sidebar = Sidebar
        sidebar.toggle(tab)
    }
})