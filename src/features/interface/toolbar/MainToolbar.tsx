import { For, useContext } from 'solid-js'

import Stack from '../../../components/Stack'
import { CurrentToolContext } from '../../../state/CurrentToolContext'
import KeymapContext from '../../../state/KeymapContext'
import { RegistryContext } from '../../../state/RegistryContext'
import { stringifyShortcut } from '../../../types/key_shortcut'
import './MainToolbar.css'

const MainToolbar = () => {
  const { tools } = useContext(RegistryContext)
  const currentTool = useContext(CurrentToolContext)
  const keymap = useContext(KeymapContext)

  const toolKeys = keymap.reduce((acc, keybinding) => {
    if (keybinding.command.match(/^select_tool\./)) {
      const tool = keybinding.command.replace(/^select_tool\./, '')
      if (tools[tool]) {
        acc[tool] = stringifyShortcut(keybinding.key)
      }
    }
    return acc
  }, {} as Record<string, string>)

  return (
    <Stack class="island" direction="row" padding={0.1875} spacing={0.25}>
      <For each={Object.entries(tools)}>
        {([id, tool]) => (
          <button
            aria-keyshortcuts={toolKeys[id]}
            aria-label={tool.label + ' - ' + toolKeys[id]}
            aria-pressed={currentTool.id() === id}
            class="toolbar-button"
            onClick={() => currentTool.selectId(id)}
            title={tool.label + ' - ' + toolKeys[id]}
          >
            <tool.icon />
          </button>
        )}
      </For>
    </Stack>
  )
}

export default MainToolbar
