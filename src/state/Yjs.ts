import * as Y from 'yjs'
import { IndexeddbPersistence } from 'y-indexeddb'
import { WebrtcProvider } from 'y-webrtc'
import { Accessor, createContext, createEffect, createRoot, onCleanup } from 'solid-js'
import { createStore, reconcile, unwrap } from 'solid-js/store'

export type YjsState = {
    ydoc: Y.Doc,
    persistence: IndexeddbPersistence,
    room?: Accessor<string>,
    webrtcProvider: () => WebrtcProvider | undefined
}

export type YjsActions = {
    createRoom: (room: string) => void
}

const useSearchParams = <T extends Record<string, string>>() => {
    const [searchParams, setSearchParams] = createStore<Partial<T>>({})

    const update = () => {
        const searchParams = new URLSearchParams(window.location.search)
        const params: Record<string, string> = {}
        for (const [key, value] of searchParams) {
            params[key] = value || ''
        }
        setSearchParams(reconcile(params as T))
    }

    update()

    window.addEventListener('popstate', update)
    onCleanup(() => {
        window.removeEventListener('popstate', update)
    })

    return [searchParams, setSearchParams] as const
}

export const Yjs: [
    state: YjsState,
    actions: YjsActions
] = createRoot(() => {
    const ydoc = new Y.Doc()
    const persistence = new IndexeddbPersistence('project', ydoc)
    const [searchParams, setSearchParams] = useSearchParams<{
        room?: string
    }>()
    let webrtcProvider: WebrtcProvider | undefined = undefined

    const createRoom = (room: string) => {
        setSearchParams({ room })
    }

    createEffect(() => {
        if (!searchParams.room) {
            return
        }

        webrtcProvider = new WebrtcProvider(searchParams.room, ydoc)
        webrtcProvider.awareness.setLocalStateField('user', {
            name: 'user-' + Math.floor(Math.random() * 100)
        })
        webrtcProvider.connect()

        webrtcProvider.on('synced', () => {
            console.log('synced')
        })
    })

    onCleanup(() => {
        webrtcProvider?.disconnect()
    })

    return [{
        ydoc,
        persistence,
        room: () => searchParams.room || '',
        webrtcProvider: () => webrtcProvider
    },
    {
        createRoom
    }]
})

export const YjsContext = createContext<[YjsState, YjsActions]>(Yjs)
