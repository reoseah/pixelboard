import Registry from "../../state/Registry";
import Sidebar from "../../state/Sidebar";
import Command from "./command";

export const ToggleSidebar: Command = {
    id: "toggle_sidebar",
    label: () => "Toggle Sidebar",
    isDisabled: () => false,
    execute: () => {
        const [, actions] = Sidebar
        actions.toggle()
    }
}

export const createTabCommand = (tab: string): Command => ({
    id: `toggle_tab.${tab}`,
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