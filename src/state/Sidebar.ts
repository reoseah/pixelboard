import { Accessor, createContext, createRoot, createSignal } from "solid-js"

export type SidebarState = {
    // activeTab: Accessor<string | null>
    open: Accessor<boolean>
    tab: Accessor<string>
}

export type SidebarActions = {
    toggle: (tab?: string) => void,
    close: () => void,
}

const DefaultSidebar: [
    state: SidebarState,
    actions: SidebarActions
] = createRoot(() => {
    const [open, setOpen] = createSignal(false)
    const [tab, setTab] = createSignal("menu")

    const toggle = (newTab?: string) => {
        if (newTab) {
            setTab(newTab)
        }
        setOpen(!open())
    }

    const close = () => {
        setOpen(false)
    }

    return [
        { open, tab },
        { toggle, close }
    ]
})

export default DefaultSidebar

export const SidebarContext = createContext(DefaultSidebar)