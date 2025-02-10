import { createEffect } from 'solid-js'
import { Toolbar } from './components/Toolbar'
import { Viewport } from './components/Viewport'
import ZoomButtons from './components/ZoomButtons'
import Tools from './features/tools'
import SelectedTool from './state/selected-tool'

function App() {
	createEffect(() => {
		const tool = Tools[SelectedTool.id()]

		tool?.onSelected?.()
	})

	return (
		<>
			<Viewport />
			<div class="pointer-events-none absolute inset-x-auto top-4 grid w-screen place-content-center gap-1 *:pointer-events-auto">
				<Toolbar />
			</div>
			<div class="pointer-events-none absolute bottom-4 left-4 *:pointer-events-auto">
				<ZoomButtons />
			</div>
		</>
	)
}

export default App
