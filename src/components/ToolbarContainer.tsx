import { For, Show, useContext } from "solid-js"
import "./ToolbarContainer.css"
import { RegistryContext } from "../state/Registry"
import { SelectedToolContext } from "../state/SelectedTool"
import { Dynamic } from "solid-js/web"
import DefaultKeymap, { stringifyKeybind } from "../state/Keymap"

const ToolbarContainer = () => {
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
        <div class="toolbar-container">
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
                            {/* <div class="toolbar-button-hint">
                                {tool.key}
                            </div> */}
                        </button>
                    )}
                </For>
            </div>
            <Show when={tools[selectedTool()].subToolbar}>
                <div class="toolbar">
                    <Dynamic component={tools[selectedTool()].subToolbar} />
                </div>
            </Show>
        </div>
    )
}

export default ToolbarContainer