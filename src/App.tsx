import { Component, createMemo, For, onCleanup, Show, useContext } from 'solid-js'
import { createStore, reconcile } from 'solid-js/store'
import { Dynamic } from 'solid-js/web'

import './App.css'
import VirtualCanvas from './features/canvas/VirtualCanvas'
import SelectionRenderer from './features/canvas_selection/SelectionRenderer'
import SideLayout from './features/interface/SideLayout'
import MainToolbar from './features/interface/toolbar/MainToolbar'
import TopCenterLayout from './features/interface/TopCenterLayout'
import Sidebar from './features/sidebar/Sidebar'
import ViewportContainer from './features/viewport/ViewportContainer'
import { CurrentToolContext } from './state/CurrentToolContext'
import KeymapContext from './state/KeymapContext'
import RegistryContext from './state/RegistryContext'
import { WhiteboardContext } from './state/WhiteboardContext'
import { Tool } from './types/tool'
import { Entity } from './types/whiteboard'

function App() {
  useCommandKeybinds()

  return (
    <>
      <ViewportContainer>
        <VirtualCanvas />
        <CurrentToolRenderer map={tool => tool.viewport} />
        <SelectionRenderer />
        <ElementsRenderer />
      </ViewportContainer>
      <TopCenterLayout>
        <MainToolbar />
        <CurrentToolRenderer map={tool => tool.subToolbar} />
      </TopCenterLayout>
      <SideLayout>
        <Sidebar />
      </SideLayout>
      <CurrentToolRenderer map={tool => tool.use} />
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
  const { commands } = useContext(RegistryContext)
  const keymap = useContext(KeymapContext)

  const handleKeyDown = (event: KeyboardEvent) => {
    const target = event.target as HTMLElement
    const isEditable = target.isContentEditable || target.tagName === 'INPUT' || target.tagName === 'TEXTAREA'
    if (isEditable) {
      return
    }

    const keybind = keymap.find((keybind) => {
      const key = keybind.key
      return (event.key.toUpperCase() === key.key || event.code === key.key)
        && event.ctrlKey === key.ctrl
        && event.shiftKey === key.shift
        && event.altKey === key.alt
        && event.metaKey === key.meta
    })

    if (keybind) {
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
  const whiteboard = useContext(WhiteboardContext)
  const { elementTypes } = useContext(RegistryContext)

  const [store, setStore] = createStore<Record<string, Entity>>({})

  whiteboard.entities.observe(() => {
    setStore(reconcile(whiteboard.entities.toJSON()))
  })

  return (
    <For each={Object.entries(store)}>
      {([id, element]) => {
        const type = elementTypes[element.type]
        return (
          <Dynamic component={type.render} element={element} id={id} />
        )
      }}
    </For>
  )
}
