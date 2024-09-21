import "./MainToolbar.css"
import { For, useContext } from "solid-js"
import { RegistryContext } from "../state/Registry"
import { CurrentToolContext } from "../state/CurrentTool"
import DefaultKeymap, { stringifyKeybind } from "../state/Keymap"
import Toolbar from "./ui/Toolbar"

const MainToolbar = () => {
    const { tools } = useContext(RegistryContext)
    const currentTool = useContext(CurrentToolContext)

    const toolKeys = DefaultKeymap.reduce((acc, keybinding) => {
        if (keybinding.command.match(/^select_tool\./)) {
            const tool = keybinding.command.replace(/^select_tool\./, "")
            if (tools[tool]) {
                acc[tool] = stringifyKeybind(keybinding.key)
            }
        }
        return acc
    }, {} as Record<string, string>)

    return (
        <Toolbar>
            <For each={Object.entries(tools)}>
                {([id, tool]) => (
                    <button
                        class="toolbar-button"
                        title={tool.label + " - " + toolKeys[id]}
                        aria-label={tool.label + " - " + toolKeys[id]}
                        aria-keyshortcuts={toolKeys[id]}
                        aria-pressed={currentTool.id() === id}
                        onclick={() => currentTool.selectId(id)}
                    >
                        <tool.icon />
                    </button>
                )}
            </For>
        </Toolbar>
    )
}

export default MainToolbar