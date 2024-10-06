import type { Command } from '../../types/commands'
import type { SidebarState } from '../SidebarContext'

import SidebarIcon from '../../assets/icons/sidebar.svg'

const createToggleSidebarCommand = (sidebarState: SidebarState): Command => ({
  id: 'toggle_sidebar',
  label: () => 'Toggle Sidebar',
  icon: SidebarIcon,
  execute: () => {
    sidebarState.toggleOrOpen()
  },
})

export default createToggleSidebarCommand
