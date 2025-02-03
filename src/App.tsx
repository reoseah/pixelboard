import { Toolbar } from './components/Toolbar'
import { Viewport } from './components/Viewport'
import { ActiveToolProvider } from './features/tools/state'
import { WhiteboardStateProvider } from './state/whiteboard'

function App() {
	return (
		<WhiteboardStateProvider>
			<ActiveToolProvider>
				<Viewport />
				<div class="pointer-events-none absolute inset-x-auto top-2 grid w-screen place-content-center gap-1 *:pointer-events-auto">
					<Toolbar />
				</div>
			</ActiveToolProvider>
		</WhiteboardStateProvider>
	)
}

export default App
