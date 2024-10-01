import * as Y from "yjs"
import { Accessor, createRoot, createSignal, createContext, useContext } from "solid-js"
import { YjsContext } from "../Yjs"
import DefaultRegistry from "../Registry"
import { Entity } from "./entity"

export type WhiteboardState = {
    entities: Y.Map<Entity>,
    selected: Accessor<string[]>,
    editingTitle: Accessor<string | null>

    set: (id: string, element: Entity) => void
    remove: (id: string) => void

    select: (ids: string[]) => void
    setEditingTitle: (id: string | null) => void

    clear: () => void

    getElementsInside: (x: number, y: number, width: number, height: number) => string[]
}

export const DefaultWhiteboard: WhiteboardState = createRoot(() => {
    const [yjs] = useContext(YjsContext)

    const entities = yjs.ydoc.getMap<Entity>("board-elements")
    const [selected, setSelected] = createSignal<string[]>([])
    const [editingTitle, setEditingTitle] = createSignal<string | null>(null)

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
        entities,

        selected,
        select,

        editingTitle,
        setEditingTitle,

        set,
        remove,
        clear,
        getElementsInside
    }
})

export const WhiteboardContext = createContext(DefaultWhiteboard)

export default WhiteboardContext