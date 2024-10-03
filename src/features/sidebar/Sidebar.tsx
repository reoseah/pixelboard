import { For, Show, useContext } from 'solid-js'
import { Dynamic } from 'solid-js/web'

import Keymap from '../../state/Keymap'
import { RegistryContext } from '../../state/RegistryContext'
import { SidebarContext } from '../../state/SidebarContext'
import { stringifyShortcut } from '../../types/key_shortcut'
import './Sidebar.css'

const Sidebar = () => {
  const context = useContext(SidebarContext)
  const { tabs } = useContext(RegistryContext)

  const tabKeys = Keymap.reduce((acc, keybinding) => {
    if (keybinding.command.match(/^toggle_tab\./)) {
      const tab = keybinding.command.replace(/^toggle_tab\./, '')
      if (tabs[tab]) {
        acc[tab] = stringifyShortcut(keybinding.key)
      }
    }
    return acc
  }, {} as Record<string, string>)

  const TabGroup = (props: {
    place: 'bottom' | 'top'
  }) => {
    const filtered = Object.entries(tabs).filter(([, tab]) => tab.place === props.place)

    return (
      <div class="sidebar-tab-group">
        <For each={filtered}>
          {([id, tab]) => (
            <button
              aria-pressed={context.isOpen() && context.tab() === id}
              class="sidebar-tab"
              onClick={() => context.toggle(id)}
              title={`${tab.label} - ${tabKeys[id]}`}
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
        <div class="sidebar-divider" />
        <div class="sidebar-content">
          <Dynamic component={tabs[context.tab()!].contents} />
        </div>
      </Show>
    </div>
  )
}

export default Sidebar
