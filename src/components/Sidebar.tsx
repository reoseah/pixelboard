import "./Sidebar.css"
import { For, Show, useContext } from "solid-js"
import { Dynamic } from "solid-js/web"
import { RegistryContext } from "../state/Registry"
import { SidebarContext } from "../state/Sidebar"

const Sidebar = () => {
    const [state, actions] = useContext(SidebarContext)
    const { tabs } = useContext(RegistryContext)

    return (
        <div class="sidebar">
            <div class="sidebar-tabs">
                <TabGroup
                    tabs={tabs}
                    place="top"
                    activeTab={state.open() ? state.tab() : null}
                    onTabClick={actions.toggle}
                />
                <TabGroup
                    tabs={tabs}
                    place="bottom"
                    activeTab={state.open() ? state.tab() : null}
                    onTabClick={actions.toggle}
                />
            </div>
            <Show when={state.open()}>
                <div class="sidebar-divider"></div>
                <div class="sidebar-content">
                    <Dynamic component={tabs[state.tab()!].contents} />
                </div>
            </Show>
        </div>
    )
}

const TabGroup = (props: {
    tabs: Record<string, any>,
    place: "top" | "bottom",
    activeTab: string | null,
    onTabClick: (activityId: string) => void
}) => {
    const filtered = Object.entries(props.tabs).filter(([_, tab]) => tab.place === props.place)

    return (
        <div class="sidebar-tab-group">
            <For each={filtered}>
                {([id, tab]) => (
                    <button
                        title={tab.label}
                        class="sidebar-tab"
                        aria-pressed={props.activeTab === id}
                        onclick={() => props.onTabClick(id)}
                    >
                        <tab.icon />
                    </button>
                )}
            </For>
        </div>
    )
}

export default Sidebar