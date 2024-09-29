import * as Y from "yjs"
import BoardElement from "../core/board_elements/board_element"
import { Accessor, createRoot, createSignal } from "solid-js"
import { createContext, useContext } from "solid-js"
import { YjsContext } from "./Yjs"
import { Store } from "solid-js/store"

export type BoardElementsState = {
    elements: Y.Map<BoardElement>,
    selected: Accessor<string[]>,
    editingTitle: Accessor<string | null>
}

export type BoardElementsActions = {
    set: (id: string, element: BoardElement) => void
    remove: (id: string) => void

    select: (ids: string[]) => void
    setEditingTitle: (id: string | null) => void

    clear: () => void
}

export const BoardElements: [BoardElementsState, BoardElementsActions] = createRoot(() => {
    const [yjs, yjsActions] = useContext(YjsContext)
    const [selected, setSelected] = createSignal<string[]>([])
    const [editingTitle, setEditingTitle] = createSignal<string | null>(null)

    const state: BoardElementsState = {
        elements: yjs.ydoc.getMap("board-elements"),
        selected,
        editingTitle
    }

    const actions: BoardElementsActions = {
        set: (id: string, element: BoardElement) => {
            state.elements.set(id, element)
        },
        remove: (id: string) => {
            state.elements.delete(id)
        },

        select: (ids: string[]) => {
            setSelected(ids)
        },
        setEditingTitle,

        clear: () => {
            state.elements.clear()
        }
    }

    return [state, actions]
})

export const BoardContext = createContext(BoardElements)
