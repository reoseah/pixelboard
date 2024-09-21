import { onCleanup, Show, useContext } from 'solid-js'
import './App.css'
import MainToolbar from './components/MainToolbar'
import ViewportContainer from './components/ViewportContainer'
import Registry, { RegistryContext } from './state/Registry'
import { CurrentToolContext } from './state/CurrentTool'
import VirtualCanvasComponent from './components/VirtualCanvasComponent'
import { Dynamic } from 'solid-js/web'
import DefaultKeymap from './state/Keymap'
import Sidebar from './components/Sidebar'
import TopCenterLayout from './components/TopCenterLayout'
import SideLayout from './components/SideLayout'

function App() {
  useCommandKeybinds()

  const { tools } = useContext(RegistryContext)
  const currentTool = useContext(CurrentToolContext)

  return (
    <>
      <ViewportContainer>
        <VirtualCanvasComponent />
        <ToolView />
      </ViewportContainer>
      <TopCenterLayout>
        <MainToolbar />
        <Show when={tools[currentTool.id()].subToolbar}>
          <div class="toolbar">
            <Dynamic component={tools[currentTool.id()].subToolbar} />
          </div>
        </Show>
      </TopCenterLayout>
      <SideLayout>
        <Sidebar />
      </SideLayout>
    </>
  )
}

const ToolView = () => {
  const { tools } = useContext(RegistryContext)
  const currentTool = useContext(CurrentToolContext)

  return (
    <Show when={tools[currentTool.id()].viewportContent}>
      <Dynamic component={tools[currentTool.id()].viewportContent} />
    </Show>
  )
}
1
const useCommandKeybinds = () => {
  const handleKeyDown = (event: KeyboardEvent) => {
    const target = event.target as HTMLElement
    const isEditable = target.isContentEditable || target.tagName === 'INPUT' || target.tagName === 'TEXTAREA'
    if (isEditable) {
      return
    }

    const keymap = DefaultKeymap

    const keybind = keymap.find(keybind => {
      const key = keybind.key
      return event.key.toUpperCase() === key.key &&
        event.ctrlKey === key.ctrl &&
        event.shiftKey === key.shift &&
        event.altKey === key.alt &&
        event.metaKey === key.meta
    })

    if (keybind) {
      const { commands } = Registry
      const command = commands[keybind.command]
      if (command) {
        command.execute()

        event.preventDefault()
        event.stopPropagation()
      }
    }
  }

  document.addEventListener('keydown', handleKeyDown)
  onCleanup(() => {
    document.removeEventListener('keydown', handleKeyDown)
  })
}

export default App
