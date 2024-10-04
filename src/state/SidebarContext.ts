import { Accessor, createContext, createSignal } from 'solid-js'

export type SidebarState = {
  isOpen: Accessor<boolean>
  // Current tab when the sidebar is open,
  // or the last tab when the sidebar was closed
  tab: Accessor<string>

  toggleOrOpen: (tab?: string) => void
}

export const createSidebarState = (): SidebarState => {
  const [isOpen, setOpen] = createSignal(false)
  const [tab, setTab] = createSignal('menu')

  const toggleOrOpen = (newTab?: string) => {
    if (!newTab || newTab === tab()) {
      setOpen(!isOpen())
      return
    }
    setTab(newTab)
    setOpen(true)
  }

  return { isOpen, tab, toggleOrOpen }
}

const SidebarContext = createContext<SidebarState>()

export default SidebarContext
