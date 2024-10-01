import SidebarIcon from '../../assets/icons/sidebar.svg'
import { DefaultRegistry } from '../../state/RegistryContext'
import Sidebar from '../../state/SidebarContext'
import { Command } from '../../types/commands'

export const ToggleSidebar: Command = {
  execute: () => {
    const sidebar = Sidebar
    sidebar.toggle()
  },
  icon: SidebarIcon,
  id: 'toggle_sidebar',
  isDisabled: () => false,
  label: () => 'Toggle Sidebar',
}

export const createTabCommand = (tab: string): Command => ({
  execute: () => {
    const sidebar = Sidebar
    sidebar.toggle(tab)
  },
  icon: () => DefaultRegistry.tabs[tab].icon({}),
  id: `toggle_tab.${tab}`,
  isDisabled: () => false,
  label: () => {
    const { tabs } = DefaultRegistry
    return `Toggle ${tabs[tab].label} Tab`
  },
})
