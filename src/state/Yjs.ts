import { createContext } from 'solid-js'
import * as Y from 'yjs'

export type YjsState = {
    ydoc: Y.Doc
}

export const YjsState: YjsState = (() => {
    return {
        ydoc: new Y.Doc()
    }
})()

export const YjsContext = createContext<[YjsState]>([YjsState])