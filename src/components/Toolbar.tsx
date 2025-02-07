import { For } from 'solid-js'
import Tools from '../features/tools'
import SelectedTool from '../state/selected-tool'

export const Toolbar = () => {
	return (
		<div class="round flex w-fit gap-1 rounded-md border border-neutral-750 bg-neutral-825 p-0.75">
			<For each={Object.entries(Tools)}>
				{([id, tool]) => (
					<button
						class="grid cursor-pointer place-items-center rounded p-1 text-neutral-200 outline-none transition-colors hover:bg-neutral-750 hover:text-neutral-100 active:bg-neutral-700 active:text-neutral-50 aria-pressed:bg-primary-600 aria-pressed:text-neutral-50"
						type="button"
						aria-pressed={SelectedTool.id() === id}
						onClick={() => SelectedTool.change(id)}
					>
						<tool.icon />
					</button>
				)}
			</For>
		</div>
	)
}
