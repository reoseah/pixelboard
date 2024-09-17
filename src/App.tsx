import { onCleanup, useContext } from 'solid-js'
import './App.css'
import ToolbarContainer from './components/ToolbarContainer'
import ViewportContainer from './components/ViewportContainer'
import { RegistryContext } from './state/Registry'
import { SelectedToolContext } from './state/SelectedTool'
import VirtualCanvasComponent from './components/VirtualCanvasComponent'

function App() {
  useToolKeybinds()

  return (
    <>
      <ViewportContainer>
        <VirtualCanvasComponent />
      </ViewportContainer>
      <ToolbarContainer />
    </>
  )
}

const useToolKeybinds = () => {
  const { tools } = useContext(RegistryContext)
  const [selectedTool, selectTool] = useContext(SelectedToolContext)

  const handleKeyDown = (event: KeyboardEvent) => {
    const target = event.target as HTMLElement
    const isEditable = target.isContentEditable || target.tagName === 'INPUT' || target.tagName === 'TEXTAREA'
    if (isEditable) {
      return
    }

    const key = event.key.toUpperCase()
    const tool = Object.entries(tools).find(([, tool]) => tool.key === key)
    if (tool) {
      selectTool(tool[0])
    }
  }

  document.addEventListener('keydown', handleKeyDown)
  onCleanup(() => {
    document.removeEventListener('keydown', handleKeyDown)
  })
}

export default App
