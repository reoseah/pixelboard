import './App.css'
import { Component, createMemo, For, onCleanup, Show, useContext } from 'solid-js'
import { createStore, reconcile } from 'solid-js/store'
import { Dynamic } from 'solid-js/web'
import BoardElement from './api/board_element'
import { BoardContext } from './api/BoardElements'
import { CurrentToolContext } from './api/CurrentTool'
import DefaultKeymap from './api/Keymap'
import Registry, { RegistryContext } from './api/Registry'
import Tool from './api/tool'
import VirtualCanvasRenderer from './features/canvas/VirtualCanvasRenderer'
import SideLayout from './features/interface/SideLayout'
import MainToolbar from './features/interface/toolbar/MainToolbar'
import TopCenterLayout from './features/interface/TopCenterLayout'
import SelectionRenderer from './features/select_rectangle/SelectionRenderer'
import ViewportContainer from './features/viewport/ViewportContainer'
import Sidebar from './features/interface/sidebar/Sidebar'

function App() {
  useCommandKeybinds()

  return (
    <>
      <ViewportContainer>
        <VirtualCanvasRenderer />
        <CurrentToolRenderer map={(tool) => tool.viewport} />
        <SelectionRenderer />
        <ElementsRenderer />
      </ViewportContainer>
      <TopCenterLayout>
        <MainToolbar />
        <CurrentToolRenderer map={(tool) => tool.subToolbar} />
      </TopCenterLayout>
      <SideLayout>
        <Sidebar />
      </SideLayout>
      <CurrentToolRenderer map={(tool) => tool.use} />
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

const ElementsRenderer = () => {
  const [board] = useContext(BoardContext)
  const { elementTypes } = useContext(RegistryContext)

  const [store, setStore] = createStore<Record<string, BoardElement>>({})

  board.elements.observe(() => {
    setStore(reconcile(board.elements.toJSON()))
  })

  return (
    <For each={Object.entries(store)}>
      {([id, element]) => {
        const type = elementTypes[element.type]
        return (
          <Dynamic component={type.render} id={id} element={element} />
        )
      }}
    </For>
  )
}