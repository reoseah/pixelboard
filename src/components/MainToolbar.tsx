import "./MainToolbar.css"
import { For, useContext } from "solid-js"
import { RegistryContext } from "../state/Registry"
import { SelectedToolContext } from "../state/SelectedTool"
import DefaultKeymap, { stringifyKeybind } from "../state/Keymap"

const MainToolbar = () => {
    const { tools } = useContext(RegistryContext)
    const [selectedTool, selectTool] = useContext(SelectedToolContext)

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
        <>
            <div class="toolbar">
                <For each={Object.entries(tools)}>
                    {([id, tool]) => (
                        <button
                            class="toolbar-button"
                            title={tool.label + " - " + toolKeys[id]}
                            aria-label={tool.label + " - " + toolKeys[id]}
                            aria-keyshortcuts={toolKeys[id]}
                            aria-pressed={selectedTool() === id}
                            onclick={() => selectTool(id)}
                        >
                            <tool.icon />
                        </button>
                    )}
                </For>
            </div>
        </>
    )
}

export default MainToolbar