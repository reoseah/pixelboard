import "./Sidebar.css"
import { For, Show, useContext } from "solid-js"
import { Dynamic } from "solid-js/web"
import DefaultKeymap, { stringifyShortcut } from "../../../api/Keymap"
import { RegistryContext } from "../../../api/RegistryContext"
import { SidebarContext } from "../../../api/sidebar/SidebarContext"

const Sidebar = () => {
  const context = useContext(SidebarContext)
  const { tabs } = useContext(RegistryContext)

  const tabKeys = DefaultKeymap.reduce((acc, keybinding) => {
    if (keybinding.command.match(/^toggle_tab\./)) {
      const tab = keybinding.command.replace(/^toggle_tab\./, "")
      if (tabs[tab]) {
        acc[tab] = stringifyShortcut(keybinding.key)
      }
    }
    return acc
  }, {} as Record<string, string>)

  const TabGroup = (props: {
    place: "top" | "bottom",
  }) => {
    const filtered = Object.entries(tabs).filter(([_, tab]) => tab.place === props.place)

    return (
      <div class="sidebar-tab-group">
        <For each={filtered}>
          {([id, tab]) => (
            <button
              title={`${tab.label} - ${tabKeys[id]}`}
              class="sidebar-tab"
              aria-pressed={context.isOpen() && context.tab() === id}
              onclick={() => context.toggle(id)}
            >
              <tab.icon />
            </button>
          )}
        </For>
      </div>
    )
  }

  return (
    <div class="sidebar">
      <div class="sidebar-tabs">
        <TabGroup place="top" />
        <TabGroup place="bottom" />
      </div>
      <Show when={context.isOpen()}>
        <div class="sidebar-divider"></div>
        <div class="sidebar-content">
          <Dynamic component={tabs[context.tab()!].contents} />
        </div>
      </Show>
    </div>
  )
}


export default Sidebar