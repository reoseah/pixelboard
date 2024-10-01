import { Accessor, createContext, createRoot, createSignal } from "solid-js"

export type SidebarState = {
    open: Accessor<boolean>
    tab: Accessor<string>
}

export type SidebarActions = {
    toggle: (tab?: string) => void,
}

const DefaultSidebar: [
    state: SidebarState,
    actions: SidebarActions
] = createRoot(() => {
    const [open, setOpen] = createSignal(false)
    const [tab, setTab] = createSignal("menu")

    const toggle = (newTab?: string) => {
        if (!newTab) {
            setOpen(!open())
            return
        }
        if (newTab === tab()) {
            setOpen(!open())
            return
        }
        setTab(newTab)
        setOpen(true)
    }

    return [
        { open, tab },
        { toggle }
    ]
})

export default DefaultSidebar

export const SidebarContext = createContext(DefaultSidebar)