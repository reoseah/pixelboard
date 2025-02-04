import { Toolbar } from './components/Toolbar'
import { Viewport } from './components/Viewport'

function App() {
	return (
		<>
			<Viewport />
			<div class="pointer-events-none absolute inset-x-auto top-2 grid w-screen place-content-center gap-1 *:pointer-events-auto">
				<Toolbar />
			</div>
		</>
	)
}

export default App
