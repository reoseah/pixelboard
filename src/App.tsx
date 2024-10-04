import { MultiProvider } from '@solid-primitives/context'
import { Component, createMemo, For, onCleanup, Show, useContext } from 'solid-js'
import { createStore, reconcile } from 'solid-js/store'
import { Dynamic } from 'solid-js/web'

import './App.css'
import SelectionRenderer from './features/canvas_selection/SelectionRenderer'
import VirtualCanvas from './features/canvas/VirtualCanvas'
import SideLayout from './features/interface/SideLayout'
import TopCenterLayout from './features/interface/TopCenterLayout'
import Sidebar from './features/sidebar/Sidebar'
import MainToolbar from './features/toolbar/Toolbar'
import ViewportContainer from './features/viewport/ViewportContainer'
import CanvasSelectionContext, { createCanvasSelection } from './state/CanvasSelectionContext'
import Keymap from './state/Keymap'
import RectangleDragContext, { createRectangleDragState } from './state/RectangleDragContext'
import RegistryContext, { createRegistry, Registry } from './state/RegistryContext'
import SelectedColorContext, { createSelectedColor } from './state/SelectedColorContext'
import SelectedToolContext, { createSelectedTool } from './state/SelectedToolContext'
import SidebarContext, { createSidebarState } from './state/SidebarContext'
import VirtualCanvasContext, { createVirtualCanvasState } from './state/VirtualCanvasContext'
import { createWhiteboardElements, WhiteboardElementsContext } from './state/WhiteboardElementsContext'
import YjsContext, { createYjsState } from './state/YjsContext'
import YWebrtcContext, { createYWebrtcState } from './state/YWebrtcContext'
import { Tool } from './types/tool'
import { WhiteboardElement } from './types/whiteboard'
import ViewportPositionContext, { createViewportPosition } from './state/ViewportPositionContext'

function App() {
  const selectedTool = createSelectedTool()
  const selectedColor = createSelectedColor()
  const canvasSelection = createCanvasSelection()
  const rectangleDrag = createRectangleDragState()
  const sidebarState = createSidebarState()
  const viewportPosition = createViewportPosition()
  const yjs = createYjsState()
  const ywebrtc = createYWebrtcState(yjs.ydoc)
  const whiteboardElements = createWhiteboardElements(yjs.ydoc)
  const virtualCanvas = createVirtualCanvasState(yjs.ydoc)
  const registry = createRegistry(
    yjs,
    selectedTool,
    sidebarState,
    canvasSelection,
    virtualCanvas,
  )

  useCommandKeybinds(registry.commands)

  return (
    <MultiProvider
      values={[
        [SelectedToolContext, selectedTool],
        [SelectedColorContext, selectedColor],
        [CanvasSelectionContext, canvasSelection],
        [RectangleDragContext, rectangleDrag],
        [SidebarContext, sidebarState],
        [ViewportPositionContext, viewportPosition],
        [YjsContext, yjs],
        [YWebrtcContext, ywebrtc],
        [WhiteboardElementsContext, whiteboardElements],
        [VirtualCanvasContext, virtualCanvas],
        [RegistryContext, registry],
      ]}
    >
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
    </MultiProvider>
  )
}

const CurrentToolRenderer = (props: {
  map: (tool: Tool) => Component | undefined
}) => {
  const { tools } = useContext(RegistryContext)
  const selectedTool = useContext(SelectedToolContext)!

  const component = createMemo(() => props.map(tools[selectedTool.id()]))

  return (
    <Show when={component()}>
      <Dynamic component={component()} />
    </Show>
  )
}

const useCommandKeybinds = (commands: Registry['commands']) => {
  const handleKeyDown = (event: KeyboardEvent) => {
    const target = event.target as HTMLElement
    const isEditable = target.isContentEditable || target.tagName === 'INPUT' || target.tagName === 'TEXTAREA'
    if (isEditable) {
      return
    }

    const keybind = Keymap.find((keybind) => {
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
  const whiteboard = useContext(WhiteboardElementsContext)
  const { elementTypes } = useContext(RegistryContext)

  const [store, setStore] = createStore<Record<string, WhiteboardElement>>({})

  whiteboard.elements.observe(() => {
    setStore(reconcile(whiteboard.elements.toJSON()))
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
