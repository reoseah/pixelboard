import type { Command } from '../../types/commands'
import type { SidebarState } from '../SidebarContext'

import SidebarIcon from '../../assets/icons/sidebar.svg'

const createToggleSidebarCommand = (sidebarState: SidebarState): Command => ({
  execute: () => {
    sidebarState.toggleOrOpen()
  },
  icon: SidebarIcon,
  id: 'toggle_sidebar',
  isDisabled: () => false,
  label: () => 'Toggle Sidebar',
})

export default createToggleSidebarCommand
