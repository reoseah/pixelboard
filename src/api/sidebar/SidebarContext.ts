import { Accessor, createContext, createRoot, createSignal } from "solid-js"

export type SidebarState = {
    isOpen: Accessor<boolean>
    tab: Accessor<string>

    toggle: (tab?: string) => void,
}

const DefaultSidebar: SidebarState = createRoot(() => {
    const [isOpen, setOpen] = createSignal(false)
    const [tab, setTab] = createSignal("menu")

    const toggle = (newTab?: string) => {
        if (!newTab) {
            setOpen(!isOpen())
            return
        }
        if (newTab === tab()) {
            setOpen(!isOpen())
            return
        }
        setTab(newTab)
        setOpen(true)
    }

    return { isOpen, tab, toggle }

})

export default DefaultSidebar

export const SidebarContext = createContext(DefaultSidebar)