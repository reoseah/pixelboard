import { Toolbar } from './components/Toolbar'
import { Viewport } from './components/Viewport'
import { ActiveToolProvider } from './features/tools/state'

function App() {
	return (
		<ActiveToolProvider>
			<Viewport />
			<div class="pointer-events-none absolute inset-x-auto top-2 grid w-screen place-content-center gap-1 *:pointer-events-auto">
				<Toolbar />
			</div>
		</ActiveToolProvider>
	)
}

export default App
