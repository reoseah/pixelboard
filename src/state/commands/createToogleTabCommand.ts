import type { Command } from '../../types/commands'
import type { Registry } from '../RegistryContext'
import type { SidebarState } from '../SidebarContext'

const createToggleTabCommand = (sidebarState: SidebarState, tabs: Registry['tabs'], tab: string): Command => ({
  id: `toggle_tab.${tab}`,
  label: () => `Toggle ${tabs[tab].label} Tab`,
  icon: () => tabs[tab].icon({}),
  isDisabled: () => false,
  execute: () => {
    sidebarState.toggleOrOpen(tab)
  },
})

export default createToggleTabCommand
