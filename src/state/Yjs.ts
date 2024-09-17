import { createContext } from 'solid-js'
import * as Y from 'yjs'
import { IndexeddbPersistence } from 'y-indexeddb'

export type YjsState = {
    ydoc: Y.Doc
}

export const YjsState: YjsState = (() => {
    const ydoc = new Y.Doc()
    new IndexeddbPersistence('project', ydoc)

    return {
        ydoc
    }
})()

export const YjsContext = createContext<[YjsState]>([YjsState])