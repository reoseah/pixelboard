import Command from "../../../api/command"
import Registry from "../../../api/Registry"
import Sidebar from "../../../api/SidebarContext"
import SidebarIcon from "../../../assets/icons/sidebar.svg"

export const ToggleSidebar: Command = {
    id: "toggle_sidebar",
    icon: SidebarIcon,
    label: () => "Toggle Sidebar",
    isDisabled: () => false,
    execute: () => {
        const [, actions] = Sidebar
        actions.toggle()
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
        const [, actions] = Sidebar
        actions.toggle(tab)
    }
})