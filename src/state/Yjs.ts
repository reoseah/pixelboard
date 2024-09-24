import * as Y from 'yjs'
import { IndexeddbPersistence } from 'y-indexeddb'
import { WebrtcProvider } from 'y-webrtc'
import { Accessor, createContext, createEffect, createRoot, createSignal, onCleanup } from 'solid-js'
import { createStore, reconcile } from 'solid-js/store'
import { makePersisted } from '@solid-primitives/storage'

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
        const searchParams = new URLSearchParams()
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
    "Youthful Yak",
    "Zealous Zebra"
]

export type YjsState = {
    ydoc: Y.Doc,
    persistence: IndexeddbPersistence,
    webrtcNoSignalling: WebrtcProvider,

    room: Accessor<string | null>,
    webrtcProvider: () => WebrtcProvider | undefined,
    userName: Accessor<string | undefined>
}

export type YjsActions = {
    startSession: () => void,
    endSession: () => void,
    getShareUrl: () => string | undefined,
    setUserName: (name: string) => void
}

export const Yjs: [
    state: YjsState,
    actions: YjsActions
] = createRoot(() => {
    const ydoc = new Y.Doc()
    const persistence = new IndexeddbPersistence('project', ydoc)
    const webrtcNoSignalling = new WebrtcProvider("browser-tabs", ydoc, { signaling: [] })

    const [searchParams, setSearchParams] = useSearchParams<{
        room?: string
    }>()
    const [userName, setUserNameInternal] = makePersisted(createSignal<string>(userNamePool[Math.floor(Math.random() * userNamePool.length)]), { name: 'collaboration-username' })
    let webrtcProvider: WebrtcProvider | undefined = undefined

    const startSession = () => {
        const room = crypto.randomUUID()
        setSearchParams({ room })
    }

    const endSession = () => {
        setSearchParams({})
    }

    const getShareUrl = () => {
        const room = searchParams.room
        if (!room) {
            return
        }

        return `${window.location.origin}?room=${room}`
    }

    createEffect(() => {
        const room = searchParams.room
        if (!room) {
            webrtcProvider?.disconnect()
            webrtcProvider?.destroy()
            return
        }

        webrtcProvider?.disconnect()
        webrtcProvider?.destroy()

        webrtcProvider = new WebrtcProvider(room, ydoc, {
            filterBcConns: true,
        })

        if (userName().trim() === '') {
            setUserName(userNamePool[Math.floor(Math.random() * userNamePool.length)])
        }
        webrtcProvider.awareness.setLocalStateField('user', {
            name: userName()
        })
        webrtcProvider.connect()
    })

    const setUserName = (name: string) => {
        setUserNameInternal(name)
        if (webrtcProvider) {
            webrtcProvider.awareness.setLocalStateField('user', {
                name
            })
        }
    }

    onCleanup(() => {
        webrtcProvider?.disconnect()
        webrtcProvider?.destroy()
    })

    return [{
        ydoc,
        persistence,
        webrtcNoSignalling,
        room: () => searchParams.room || '',
        webrtcProvider: () => webrtcProvider,
        userName
    },
    {
        startSession,
        endSession,
        getShareUrl,
        setUserName
    }]
})

export const YjsContext = createContext<[YjsState, YjsActions]>(Yjs)
