import * as Y from 'yjs'
import { CanvasAction } from '../core/canvas_actions/canvas_action'
import { YjsContext } from './Yjs'
import { createContext, useContext } from 'solid-js'

export type VirtualCanvasState = {
    actions: Y.Array<CanvasAction>
}

export type VirtualCanvasActions = {
    add: (action: CanvasAction) => void
    replace: (oldAction: CanvasAction, newAction: CanvasAction) => void
    clear: () => void
}

export const VirtualCanvas: [
    state: VirtualCanvasState,
    actions: VirtualCanvasActions
] = (() => {
    const [yjs] = useContext(YjsContext)
    const state = {
        actions: yjs.ydoc.getArray<CanvasAction>("virtual-canvas-actions")
    }

    const add = (action: CanvasAction) => {
        state.actions.push([action])
    }

    const replace = (oldAction: CanvasAction, newAction: CanvasAction) => {
        let idx = -1
        for (let i = 0; i < state.actions.length; i++) {
            if (state.actions.get(i) === oldAction) {
                idx = i
                break
            }
        }
        if (idx === -1) {
            throw new Error('oldAction not found')
        }
        yjs.ydoc.transact(() => {
            state.actions.delete(idx)
            state.actions.insert(idx, [newAction])
        })
    }

    const clear = () => {
        yjs.ydoc.transact(() => {
            state.actions.delete(0, state.actions.length)
        })
    }

    const actions = {
        add,
        replace,
        clear
    }

    return [
        state,
        actions
    ]
})()

export const VirtualCanvasContext = createContext(VirtualCanvas)
