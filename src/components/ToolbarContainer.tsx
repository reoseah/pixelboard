import { For, Show, useContext } from "solid-js"
import "./ToolbarContainer.css"
import { RegistryContext } from "../state/Registry"
import { SelectedToolContext } from "../state/SelectedTool"
import { Dynamic } from "solid-js/web"

const ToolbarContainer = () => {
    const { tools } = useContext(RegistryContext)
    const [selectedTool, selectTool] = useContext(SelectedToolContext)

    return (
        <div class="toolbar-container">
            <div class="toolbar">
                <For each={Object.entries(tools)}>
                    {([id, tool]) => (
                        <button
                            class="toolbar-button"
                            title={tool.title + " - " + tool.key}
                            aria-label={tool.title + " - " + tool.key}
                            aria-keyshortcuts={tool.key}
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