import { Accessor, createContext, createRoot, createSignal, useContext } from 'solid-js'
import * as Y from 'yjs'

import { Entity } from '../types/whiteboard'
import { DefaultRegistry } from './RegistryContext'
import { YjsContext } from './YjsContext'

export type WhiteboardState = {
  entities: Y.Map<Entity>

  set: (id: string, element: Entity) => void
  remove: (id: string) => void
  clear: () => void

  getElementsInside: (x: number, y: number, width: number, height: number) => string[]

  editingTitle: Accessor<null | string>
  setEditingTitle: (id: null | string) => void

  selected: Accessor<string[]>
  select: (ids: string[]) => void
}

export const DefaultWhiteboard: WhiteboardState = createRoot(() => {
  const yjs = useContext(YjsContext)

  const entities = yjs.ydoc.getMap<Entity>('board-elements')
  const [selected, setSelected] = createSignal<string[]>([])
  const [editingTitle, setEditingTitle] = createSignal<null | string>(null)

  const set = (id: string, entity: Entity) => {
    entities.set(id, entity)
  }

  const remove = (id: string) => {
    entities.delete(id)
  }

  const select = (ids: string[]) => {
    setSelected(ids)
  }

  const clear = () => {
    entities.clear()
  }

  const getElementsInside = (x: number, y: number, width: number, height: number) => {
    const elements: string[] = []
    for (const [id, element] of entities) {
      const bounds = DefaultRegistry.elementTypes[element.type].getBounds(element)
      if (bounds.x >= x && bounds.y >= y && bounds.x + bounds.width <= x + width && bounds.y + bounds.height <= y + height) {
        elements.push(id)
      }
    }
    return elements
  }

  return {
    clear,

    editingTitle,
    entities,

    getElementsInside,
    remove,

    select,
    selected,
    set,
    setEditingTitle,
  }
})

export const WhiteboardContext = createContext(DefaultWhiteboard)

export default WhiteboardContext
