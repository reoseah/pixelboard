import "./command_palette.css"
import { createMemo, createSignal, For, JSX, onCleanup, Show, useContext } from "solid-js"
import CommandIcon from "../../assets/icons/command.svg"
import SearchIcon from "../../assets/icons/search.svg"
import { Tool } from "./tool"
import { RegistryContext } from "../../state/Registry"
import { SelectedToolContext } from "../../state/SelectedTool"
import useClickOutside from "../../hooks/useClickOutside"
import Command from "../command/command"
import { Dynamic } from "solid-js/web"
import DefaultKeymap, { stringifyKeybind } from "../../state/Keymap"

const createCommandPalette = (): Tool => {
    let prevTool: string

    const CommandPalette = () => {
        const { commands } = useContext(RegistryContext)
        const [, selectTool] = useContext(SelectedToolContext)
        const [query, setQuery] = createSignal("")
        const keymap = DefaultKeymap

        const filteredCommands = createMemo(() => {
            const queryLower = query().toLowerCase()

            return Object.values(commands)
                .filter(command => (typeof command.label === "function" ? command.label() : command.label).toLowerCase().includes(queryLower))
                .filter(command => command.isDisabled === undefined || !command.isDisabled())
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
        useClickOutside(wrapper, () => { selectTool(prevTool) })

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                selectTool(prevTool)
            }
            // TODO: handle arrow keys to navigate the list
        }
        document.addEventListener("keydown", handleKeyDown)
        onCleanup(() => document.removeEventListener("keydown", handleKeyDown))

        const handleInput: JSX.InputEventHandlerUnion<HTMLInputElement, InputEvent> = (event) => {
            setQuery(event.target.value)
            event.preventDefault()
            event.stopPropagation()
        }

        const handleCommandClick = (command: Command) => {
            selectTool(prevTool)
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
                        onInput={handleInput}
                        id="command-palette-search"
                        autocomplete="off"
                    />
                </div>
                <Show
                    when={filteredCommands().length}
                    fallback={<p class="command-palette-no-results">No results found</p>}
                >
                    <h2 class="command-palette-heading">Actions</h2>
                    <ul class="command-palette-entries">
                        <For each={filteredCommands()}>
                            {command => (
                                <li>
                                    <button
                                        class="command-palette-button"
                                        onClick={() => handleCommandClick(command)}
                                    >
                                        <div class="command-icon">
                                            <Show when={command.icon}>
                                                <Dynamic component={command.icon} />
                                            </Show>
                                        </div>
                                        <span class="command-description">{typeof command.label === "function" ? command.label() : command.label}</span>
                                        {/* <Show when={command.keybinds && command.keybinds[0]}>
                                            <kbd class="command-keybind">
                                                {stringifyKeybind(command.keybinds![0])}
                                            </kbd>
                                        </Show> */}
                                        <Show when={commandToKeybinds()[command.id]}>
                                            <kbd class="command-keybind">
                                                {commandToKeybinds()[command.id][0]}
                                            </kbd>
                                        </Show>
                                    </button>
                                </li>
                            )}
                        </For>
                    </ul>
                </Show>
            </div>
        )
    }

    return {
        label: "Actions",
        icon: CommandIcon,
        subToolbar: CommandPalette,
        onSelect: (prev: string) => {
            prevTool = prev
        }
    }
}

export default createCommandPalette