import * as Y from 'yjs'
import { IndexeddbPersistence } from 'y-indexeddb'
import { WebrtcProvider } from 'y-webrtc'
import { Accessor, createContext, createEffect, createRoot, onCleanup } from 'solid-js'
import { createStore, reconcile, unwrap } from 'solid-js/store'

export type YjsState = {
    ydoc: Y.Doc,
    persistence: IndexeddbPersistence,
    room: Accessor<string>,
    webrtcProvider: () => WebrtcProvider | undefined
}

export type YjsActions = {
    startSession: () => void
}

const useSearchParams = <T extends Record<string, string>>() => {
    const [searchParams, setSearchParamsInternal] = createStore<Partial<T>>({})

    const update = () => {
        const searchParams = new URLSearchParams(window.location.search)
        const params: Record<string, string> = {}
        for (const [key, value] of searchParams) {
            params[key] = value || ''
        }
        setSearchParamsInternal(reconcile(params as T))
    }

    update()

    window.addEventListener('popstate', update)
    onCleanup(() => {
        window.removeEventListener('popstate', update)
    })

    const setSearchParams = (params: Partial<T>) => {
        const searchParams = new URLSearchParams(window.location.search)
        for (const key in params) {
            searchParams.set(key, params[key] || '')
        }
        window.history.pushState({}, '', `${window.location.pathname}?${searchParams}`)
        update()
    }

    return [searchParams, setSearchParams] as const
}

const userNamePool = [
    "Authentic Anthelope",
    "Brave Bear",
    "Curious Camel",
    "Daring Dog",
    "Energetic Elephant",
    "Fearless Fox",
    "Gallant Giraffe",
    "Honest Hedgehog",
    "Inquisitive Iguana",
    "Jolly Jaguar",
    "Keen Kangaroo",
    "Lively Lemur",
    "Mighty Moose",
    "Noble Narwhal",
    "Optimistic Owl",
    "Playful Panda",
    "Quick Quokka",
    "Resilient Rabbit",
    "Spirited Squirrel",
    "Tenacious Tiger",
    "Unique Unicorn",
    "Valiant Vulture",
    "Wise Wolf",
    "Xenial Xerus",
    "Youthful  Yak",
    "Zealous Zebra"
]

export const Yjs: [
    state: YjsState,
    actions: YjsActions
] = createRoot(() => {
    const ydoc = new Y.Doc()
    const persistence = new IndexeddbPersistence('project', ydoc)
    const [searchParams, setSearchParams] = useSearchParams<{
        room?: string
    }>()
    let webrtcProvider: WebrtcProvider = new WebrtcProvider("browser-tabs", ydoc, { signaling: [] })

    const startSession = () => {
        const room = crypto.randomUUID()
        setSearchParams({ room })
    }

    createEffect(() => {
        const room = searchParams.room
        if (!room) {
            return
        }

        webrtcProvider?.disconnect()

        webrtcProvider = new WebrtcProvider(room, ydoc)
        webrtcProvider.awareness.setLocalStateField('user', {
            name: 'user-' + Math.floor(Math.random() * 100)
        })
        webrtcProvider.connect()
    })

    onCleanup(() => {
        webrtcProvider.disconnect()
    })

    return [{
        ydoc,
        persistence,
        room: () => searchParams.room || '',
        webrtcProvider: () => webrtcProvider
    },
    {
        startSession
    }]
})

export const YjsContext = createContext<[YjsState, YjsActions]>(Yjs)
