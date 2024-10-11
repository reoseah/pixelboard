import { makePersisted } from '@solid-primitives/storage'
import { Accessor, createContext, createSignal } from 'solid-js'
import * as Y from 'yjs'

import { NonRasterElement } from '../types/non_raster_elements'
import { Registry } from './RegistryContext'

export type NonRasterElementState = {
  elements: Y.Map<NonRasterElement>

  set: (id: string, element: NonRasterElement) => void
  remove: (id: string) => void
  clear: () => void

  selected: Accessor<string[]>
  select: (ids: string[]) => void

  highlighted: Accessor<string[]>
  highlight: (ids: string[]) => void

  titleBeingEdited: Accessor<null | string>
  setTitleBeingEdited: (id: null | string) => void
}

const NonRasterElementsContext = createContext<NonRasterElementState>(undefined as unknown as NonRasterElementState)

export default NonRasterElementsContext

export const createNonRasterElementState = (ydoc: Y.Doc): NonRasterElementState => {
  const elements = ydoc.getMap<NonRasterElement>('board-elements')

  const [selected, setSelected] = makePersisted(createSignal<string[]>([]), { name: 'selected-elements' })
  const [highlighted, setHighlighted] = createSignal<string[]>([])
  const [titleBeingEdited, setTitleBeingEdited] = createSignal<null | string>(null)

  const set = (id: string, entity: NonRasterElement) => {
    elements.set(id, entity)
  }

  const remove = (id: string) => {
    elements.delete(id)
  }

  const select = (ids: string[]) => {
    setSelected(ids)
  }

  const clear = () => {
    elements.clear()
  }

  const highlight = (ids: string[]) => {
    setHighlighted(ids)
  }

  return {
    elements,
    set,
    remove,
    clear,
    selected,
    select,
    highlighted,
    highlight,
    titleBeingEdited,
    setTitleBeingEdited,
  }
}

export const getElementsInside = (whiteboard: NonRasterElementState, elementTypes: Registry['nonRasterElements'], x: number, y: number, width: number, height: number) => {
  const output: string[] = []
  for (const [id, element] of whiteboard.elements) {
    const bounds = elementTypes[element.type].getBounds(element)
    if (bounds.x >= x && bounds.y >= y && bounds.x + bounds.width <= x + width && bounds.y + bounds.height <= y + height) {
      output.push(id)
    }
  }
  return output
}
