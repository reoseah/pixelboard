import { For, useContext } from 'solid-js'
import { ToolRegistry, ToolSelectionContext } from '../features/tools/state'

export const Toolbar = () => {
	const tools = useContext(ToolRegistry)
	const selectedTool = useContext(ToolSelectionContext)

	return (
		<div class="round flex w-fit gap-1 rounded-lg border border-neutral-750 bg-neutral-825 p-1">
			<For each={Object.entries(tools)}>
				{([id, tool]) => (
					<button
						class="grid h-9 w-9 cursor-pointer place-items-center rounded-md text-neutral-200 transition-colors hover:bg-neutral-750 hover:text-neutral-100 active:bg-neutral-700 active:text-neutral-50 aria-pressed:bg-primary-600 aria-pressed:text-neutral-50"
						type="button"
						aria-pressed={selectedTool.id() === id}
						onClick={() => selectedTool.select(id)}
					>
						<tool.icon />
					</button>
				)}
			</For>
		</div>
	)
}
