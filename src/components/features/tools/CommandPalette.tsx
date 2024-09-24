import "./CommandPalette.css"
import { useContext, createSignal, createMemo, onCleanup, Show, For } from "solid-js"
import { JSX } from "solid-js/jsx-runtime"
import { Dynamic } from "solid-js/web"
import { RegistryContext } from "../../../state/Registry"
import Command from "../../../core/command/command"
import { CurrentToolContext } from "../../../state/CurrentTool"
import DefaultKeymap, { stringifyKeybind } from "../../../state/Keymap"
import useClickOutside from "../../../hooks/useClickOutside"
import SearchIcon from "../../../assets/icons/search.svg"

const CommandPalette = () => {
  const { commands } = useContext(RegistryContext)
  const currentTool = useContext(CurrentToolContext)
  const [query, setQuery] = createSignal("")
  const [selectedEntry, setSelectedEntry] = createSignal<number>(0)
  const keymap = DefaultKeymap

  const matchingCommands = createMemo(() => {
    const queryLower = query().toLowerCase()

    return Object.values(commands)
      .filter(command => (typeof command.label === "function" ? command.label() : command.label).toLowerCase().includes(queryLower))
  })

  const matchingEnabledCommands = createMemo(() => {
    return matchingCommands().filter(command => command.isDisabled === undefined || !command.isDisabled())
  })
  const matchingDisabledCommands = createMemo(() => {
    return matchingCommands().filter(command => command.isDisabled !== undefined && command.isDisabled())
  })

  const commandToKeybinds = createMemo(() => {
    const keybinds: Record<string, string[]> = {}
    for (const keybinding of keymap) {
      if (keybinds[keybinding.command]) {
        keybinds[keybinding.command].push(stringifyKeybind(keybinding.key))
      } else {
        keybinds[keybinding.command] = [stringifyKeybind(keybinding.key)]
      }
    }
    return keybinds
  })

  const [wrapper, setWrapper] = createSignal<HTMLDivElement>()
  useClickOutside(wrapper, () => { currentTool.selectId(currentTool.prevId()) })

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      currentTool.selectId(currentTool.prevId())
    } else if (event.key === "Enter") {
      const firstCommand = matchingEnabledCommands()[selectedEntry()]
      if (firstCommand) {
        currentTool.selectId(currentTool.prevId())
        firstCommand.execute()
      }
    } else if (event.key === "ArrowDown") {
      setSelectedEntry((selectedEntry() + 1) % matchingEnabledCommands().length)
    } else if (event.key === "ArrowUp") {
      setSelectedEntry((selectedEntry() - 1 + matchingEnabledCommands().length) % matchingEnabledCommands().length)
    }
  }
  document.addEventListener("keydown", handleKeyDown)
  onCleanup(() => document.removeEventListener("keydown", handleKeyDown))

  const handleInput: JSX.InputEventHandlerUnion<HTMLInputElement, InputEvent> = (event) => {
    setQuery(event.target.value)
    setSelectedEntry(0)
  }

  const handleCommandClick = (command: Command) => {
    currentTool.selectId(currentTool.prevId())
    command.execute()
  }

  return (
    <div class="command-palette" ref={setWrapper}>
      <div class="command-palette-search">
        <SearchIcon />
        <input
          type="text"
          placeholder="Search"
          maxlength="150"
          spellcheck={false}
          ref={el => requestAnimationFrame(() => el.focus())}
          oninput={handleInput}
          onkeydown={e => {
            if (e.key === "ArrowDown" || e.key === "ArrowUp") {
              e.preventDefault()
              e.stopPropagation()
            }
          }}
          id="command-palette-search"
          autocomplete="off"
        />
      </div>
      <Show
        when={matchingCommands().length}
        fallback={<p class="command-palette-no-results">No results found</p>}
      >
        <h2 class="command-palette-heading">Actions</h2>
        <ul class="command-palette-entries">
          <For each={matchingEnabledCommands()}>
            {(command, idx) => (
              <li>
                <button
                  class="command-palette-button"
                  onClick={() => handleCommandClick(command)}
                  aria-selected={selectedEntry() === idx()}
                  onmouseover={() => setSelectedEntry(idx())}
                >
                  <div class="command-icon">
                    <Show when={command.icon}>
                      <Dynamic component={command.icon} />
                    </Show>
                  </div>
                  <span class="command-description">{typeof command.label === "function" ? command.label() : command.label}</span>
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
                    onClick={() => handleCommandClick(command)}
                    disabled={true}
                    onmouseover={() => setSelectedEntry(idx())}
                  >
                    <div class="command-icon">
                      <Show when={command.icon}>
                        <Dynamic component={command.icon} />
                      </Show>
                    </div>
                    <span class="command-description">{typeof command.label === "function" ? command.label() : command.label}</span>
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