import { MultiProvider } from '@solid-primitives/context'
import { Component, createMemo, For, onCleanup, Show, useContext } from 'solid-js'
import { createStore, reconcile } from 'solid-js/store'
import { Dynamic } from 'solid-js/web'

import './App.css'
import SelectionRenderer from './components/app/SelectionRenderer'
import Sidebar from './components/app/Sidebar'
import Toolbar from './components/app/Toolbar'
import Viewport from './components/app/Viewport'
import VirtualCanvas from './components/app/VirtualCanvas'
import CanvasSelectionContext, { createCanvasSelection } from './state/CanvasSelectionContext'
import Keymap from './state/Keymap'
import NonRasterElementsContext, { createNonRasterElementState as createWhiteboardState } from './state/NonRasterElementsContext'
import RectangleDragContext, { createRectangleDragState } from './state/RectangleDragContext'
import RegistryContext, { createRegistry, Registry } from './state/RegistryContext'
import SavePropertiesContext, { createSaveProperties } from './state/SavePropertiesContext'
import SelectedColorContext, { createSelectedColor } from './state/SelectedColorContext'
import SelectedToolContext, { createSelectedTool } from './state/SelectedToolContext'
import SidebarContext, { createSidebarState } from './state/SidebarContext'
import ViewportPositionContext, { createViewportPosition } from './state/ViewportPositionContext'
import VirtualCanvasContext, { createVirtualCanvasState } from './state/VirtualCanvasContext'
import YjsContext, { createYjsState } from './state/YjsContext'
import YWebrtcContext, { createYWebrtcState } from './state/YWebrtcContext'
import { NonRasterElement } from './types/non_raster_elements'
import { Tool } from './types/tool'

function App() {
  const selectedTool = createSelectedTool()
  const selectedColor = createSelectedColor()
  const canvasSelection = createCanvasSelection()
  const rectangleDrag = createRectangleDragState()
  const saveProperties = createSaveProperties()
  const sidebarState = createSidebarState()
  const viewportPosition = createViewportPosition()
  const yjs = createYjsState()
  const ywebrtc = createYWebrtcState(yjs.ydoc)
  const whiteboard = createWhiteboardState(yjs.ydoc)
  const virtualCanvas = createVirtualCanvasState(yjs.ydoc)
  const registry = createRegistry(
    yjs,
    selectedTool,
    sidebarState,
    canvasSelection,
    virtualCanvas,
    whiteboard,
  )

  useCommandKeybinds(registry.commands)

  return (
    <MultiProvider
      values={[
        [SelectedToolContext, selectedTool],
        [SelectedColorContext, selectedColor],
        [CanvasSelectionContext, canvasSelection],
        [RectangleDragContext, rectangleDrag],
        [SavePropertiesContext, saveProperties],
        [SidebarContext, sidebarState],
        [ViewportPositionContext, viewportPosition],
        [YjsContext, yjs],
        [YWebrtcContext, ywebrtc],
        [NonRasterElementsContext, whiteboard],
        [VirtualCanvasContext, virtualCanvas],
        [RegistryContext, registry],
      ]}
    >
      <Viewport>
        <VirtualCanvas />
        <CurrentToolRenderer map={tool => tool.viewport} />
        <SelectionRenderer />
        <ElementsRenderer />
      </Viewport>
      <div class="interface">
        <Toolbar />
        <CurrentToolRenderer map={tool => tool.subToolbar} />
        <Sidebar />
      </div>
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
  const whiteboard = useContext(NonRasterElementsContext)
  const { elementTypes } = useContext(RegistryContext)

  const [store, setStore] = createStore<Record<string, NonRasterElement>>({})

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
