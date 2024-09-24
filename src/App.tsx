import './App.css'
import { Component, createMemo, onCleanup, Show, useContext } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import Registry, { RegistryContext } from './state/Registry'
import DefaultKeymap from './state/Keymap'
import Tool from './core/tools/tool'
import { CurrentToolContext } from './state/CurrentTool'
import SideLayout from './components/features/sidebar/SideLayout'
import Sidebar from './components/features/sidebar/Sidebar'
import MainToolbar from './components/features/tools/MainToolbar'
import TopCenterLayout from './components/features/tools/TopCenterLayout'
import SelectionRenderer from './components/features/viewport/SelectionRenderer'
import ViewportContainer from './components/features/viewport/ViewportContainer'
import VirtualCanvasRenderer from './components/features/viewport/VirtualCanvasRenderer'

function App() {
  useCommandKeybinds()

  return (
    <>
      <ViewportContainer>
        <VirtualCanvasRenderer />
        <CurrentToolRenderer map={(tool) => tool.viewport} />
        <SelectionRenderer />
      </ViewportContainer>
      <TopCenterLayout>
        <MainToolbar />
        <CurrentToolRenderer map={(tool) => tool.subToolbar} />
      </TopCenterLayout>
      <SideLayout>
        <Sidebar />
      </SideLayout>
    </>
  )
}

const CurrentToolRenderer = (props: {
  map: (tool: Tool) => Component | undefined
}) => {
  const { tools } = useContext(RegistryContext)
  const currentTool = useContext(CurrentToolContext)

  const component = createMemo(() => props.map(tools[currentTool.id()]))

  return (
    <Show when={component()}>
      <Dynamic component={component()} />
    </Show>
  )
}

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
      return (event.key.toUpperCase() === key.key || event.code === key.key) &&
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
