import * as Y from 'yjs'
import { CanvasAction } from '../core/canvas_actions/canvas_action'
import { YjsState } from './Yjs'
import { createContext } from 'solid-js'

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
    const ydoc = YjsState.ydoc
    const state = {
        actions: ydoc.getArray<CanvasAction>("virtual-canvas-actions")
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
        YjsState.ydoc.transact(() => {
            state.actions.delete(idx)
            state.actions.insert(idx, [newAction])
        })
    }

    const clear = () => {
        YjsState.ydoc.transact(() => {
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
