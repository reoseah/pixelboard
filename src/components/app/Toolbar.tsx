import { For, useContext } from 'solid-js'

import Keymap from '../../state/Keymap'
import RegistryContext from '../../state/RegistryContext'
import SelectedToolContext from '../../state/SelectedToolContext'
import { stringifyShortcut } from '../../types/key_shortcut'
import Stack from '../generic/Stack'
import './Toolbar.css'

const Toolbar = () => {
  const { tools } = useContext(RegistryContext)
  const selectedTool = useContext(SelectedToolContext)!

  const toolKeys = Keymap.reduce((acc, keybinding) => {
    if (keybinding.command.match(/^select_tool\./)) {
      const tool = keybinding.command.replace(/^select_tool\./, '')
      if (tools[tool]) {
        acc[tool] = stringifyShortcut(keybinding.key)
      }
    }
    return acc
  }, {} as Record<string, string>)

  return (
    <Stack class="main-toolbar island" direction="row" padding={0.1875} spacing={0.25}>
      <For each={Object.entries(tools)}>
        {([id, tool]) => (
          <button
            aria-keyshortcuts={toolKeys[id]}
            aria-label={tool.label + ' - ' + toolKeys[id]}
            aria-pressed={selectedTool.id() === id}
            class="toolbar-button"
            onClick={() => selectedTool.selectId(id)}
            title={tool.label + ' - ' + toolKeys[id]}
          >
            <tool.icon />
          </button>
        )}
      </For>
    </Stack>
  )
}

export default Toolbar
