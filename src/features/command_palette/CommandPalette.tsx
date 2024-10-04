import { createMemo, createSignal, For, onCleanup, Show, useContext } from 'solid-js'
import { JSX } from 'solid-js/jsx-runtime'
import { Dynamic } from 'solid-js/web'

import SearchIcon from '../../assets/icons/search.svg'
import useClickOutside from '../../hooks/useClickOutside'
import Keymap from '../../state/Keymap'
import RegistryContext from '../../state/RegistryContext'
import SelectedToolContext from '../../state/SelectedToolContext'
import { Command } from '../../types/commands'
import { stringifyShortcut } from '../../types/key_shortcut'
import './CommandPalette.css'

const CommandPalette = () => {
  const { commands } = useContext(RegistryContext)
  const selectedTool = useContext(SelectedToolContext)!
  const [query, setQuery] = createSignal('')
  const [selectedEntry, setSelectedEntry] = createSignal<number>(0)

  const matchingCommands = createMemo(() => {
    const queryLower = query().toLowerCase()

    return Object.values(commands)
      .filter(command => (typeof command.label === 'function' ? command.label() : command.label).toLowerCase().includes(queryLower))
  })

  const matchingEnabledCommands = createMemo(() => {
    return matchingCommands().filter(command => command.isDisabled === undefined || !command.isDisabled())
  })
  const matchingDisabledCommands = createMemo(() => {
    return matchingCommands().filter(command => command.isDisabled !== undefined && command.isDisabled())
  })

  const commandToKeybinds = createMemo(() => {
    const keybinds: Record<string, string[]> = {}
    for (const keybinding of Keymap) {
      if (keybinds[keybinding.command]) {
        keybinds[keybinding.command].push(stringifyShortcut(keybinding.key))
      }
      else {
        keybinds[keybinding.command] = [stringifyShortcut(keybinding.key)]
      }
    }
    return keybinds
  })

  const [wrapper, setWrapper] = createSignal<HTMLDivElement>()
  useClickOutside(wrapper, () => {
    selectedTool.selectId(selectedTool.prevId())
  })

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      selectedTool.selectId(selectedTool.prevId())
    }
    else if (event.key === 'Enter') {
      const firstCommand = matchingEnabledCommands()[selectedEntry()]
      if (firstCommand) {
        selectedTool.selectId(selectedTool.prevId())
        firstCommand.execute()
      }
    }
    else if (event.key === 'ArrowDown') {
      setSelectedEntry((selectedEntry() + 1) % matchingEnabledCommands().length)
    }
    else if (event.key === 'ArrowUp') {
      setSelectedEntry((selectedEntry() - 1 + matchingEnabledCommands().length) % matchingEnabledCommands().length)
    }
  }
  document.addEventListener('keydown', handleKeyDown)
  onCleanup(() => document.removeEventListener('keydown', handleKeyDown))

  const handleInput: JSX.InputEventHandlerUnion<HTMLInputElement, InputEvent> = (event) => {
    setQuery(event.target.value)
    setSelectedEntry(0)
  }

  const handleCommandClick = (command: Command) => {
    selectedTool.selectId(selectedTool.prevId())
    command.execute()
  }

  return (
    <div class="command-palette" ref={setWrapper}>
      <div class="command-palette-search">
        <SearchIcon />
        <input
          autocomplete="off"
          id="command-palette-search"
          maxlength="150"
          onInput={handleInput}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
              e.preventDefault()
              e.stopPropagation()
            }
          }}
          placeholder="Search"
          ref={el => requestAnimationFrame(() => el.focus())}
          spellcheck={false}
          type="text"
        />
      </div>
      <Show
        fallback={<p class="command-palette-no-results">No results found</p>}
        when={matchingCommands().length}
      >
        <h2 class="command-palette-heading">Actions</h2>
        <ul class="command-palette-entries">
          <For each={matchingEnabledCommands()}>
            {(command, idx) => (
              <li>
                <button
                  aria-selected={selectedEntry() === idx()}
                  class="command-palette-button"
                  onClick={() => handleCommandClick(command)}
                  onMouseOver={() => setSelectedEntry(idx())}
                >
                  <div class="command-icon">
                    <Show when={command.icon}>
                      <Dynamic component={command.icon} />
                    </Show>
                  </div>
                  <span
                    class="command-description"
                  >
                    {typeof command.label === 'function' ? command.label() : command.label}
                  </span>
                  <Show when={commandToKeybinds()[command.id]}>
                    <kbd class="command-keybind">
                      {commandToKeybinds()[command.id][0]}
                    </kbd>
                  </Show>
                </button>
              </li>
            )}
          </For>
          <Show when={query().length !== 0}>
            <For each={matchingDisabledCommands()}>
              {(command, idx) => (
                <li>
                  <button
                    class="command-palette-button"
                    disabled={true}
                    onClick={() => handleCommandClick(command)}
                    onMouseOver={() => setSelectedEntry(idx())}
                  >
                    <div class="command-icon">
                      <Show when={command.icon}>
                        <Dynamic component={command.icon} />
                      </Show>
                    </div>
                    <span
                      class="command-description"
                    >
                      {typeof command.label === 'function' ? command.label() : command.label}
                    </span>
                    <Show when={commandToKeybinds()[command.id]}>
                      <kbd class="command-keybind">
                        {commandToKeybinds()[command.id][0]}
                      </kbd>
                    </Show>
                  </button>
                </li>
              )}
            </For>
          </Show>
        </ul>
      </Show>
    </div>
  )
}

export default CommandPalette
