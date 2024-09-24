import "./Sidebar.css"
import { For, Show, useContext } from "solid-js"
import { Dynamic } from "solid-js/web"
import { SidebarContext } from "../../../state/Sidebar"
import { RegistryContext } from "../../../state/Registry"
import DefaultKeymap, { stringifyKeybind } from "../../../state/Keymap"

const Sidebar = () => {
    const [state, actions] = useContext(SidebarContext)
    const { tabs } = useContext(RegistryContext)

    const tabKeys = DefaultKeymap.reduce((acc, keybinding) => {
        if (keybinding.command.match(/^toggle_tab\./)) {
            const tab = keybinding.command.replace(/^toggle_tab\./, "")
            if (tabs[tab]) {
                acc[tab] = stringifyKeybind(keybinding.key)
            }
        }
        return acc
    }, {} as Record<string, string>)

    return (
        <div class="sidebar">
            <div class="sidebar-tabs">
                <TabGroup
                    tabs={tabs}
                    place="top"
                    activeTab={state.open() ? state.tab() : null}
                    onTabClick={actions.toggle}
                    tabKeys={tabKeys}
                />
                <TabGroup
                    tabs={tabs}
                    place="bottom"
                    activeTab={state.open() ? state.tab() : null}
                    onTabClick={actions.toggle}
                    tabKeys={tabKeys}
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
    onTabClick: (activityId: string) => void,
    tabKeys: Record<string, string>,
}) => {
    const filtered = Object.entries(props.tabs).filter(([_, tab]) => tab.place === props.place)

    return (
        <div class="sidebar-tab-group">
            <For each={filtered}>
                {([id, tab]) => (
                    <button
                        title={`${tab.label} - ${props.tabKeys[id]}`}
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