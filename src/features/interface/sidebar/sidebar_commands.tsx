import { Command } from "../../../types/commands"
import { DefaultRegistry } from "../../../state/RegistryContext"
import Sidebar from "../../../state/SidebarContext"
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
    icon: () => DefaultRegistry.tabs[tab].icon({}),
    label: () => {
        const { tabs } = DefaultRegistry
        return `Toggle ${tabs[tab].label} Tab`
    },
    isDisabled: () => false,
    execute: () => {
        const sidebar = Sidebar
        sidebar.toggle(tab)
    }
})