import * as Y from 'yjs'
import { IndexeddbPersistence } from 'y-indexeddb'
import { WebrtcProvider } from 'y-webrtc'
import { Accessor, createContext, createEffect, createRoot, createSignal, onCleanup } from 'solid-js'
import { makePersisted } from '@solid-primitives/storage'
import useSearchParams from '../hooks/useSearchParams'

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

type YjsSearchParams = {
    room?: string
}

const userNamePool = [
    "Authentic Anthelope",
    "Brave Bear",
    "Curious Cat",
    "Daring Dog",
    "Energetic Elephant",
    "Fearless Fox",
    "Generous Gazelle",
    "Humble Hamster",
    "Inquisitive Iguana",
    "Jolly Jaguar",
    "Keen Kangaroo",
    "Leisurely Lemur",
    "Magnetic Mongoose",
    "Nimble Newt",
    "Omniscient Ocelot",
    "Playful Panda",
    "Quick Quokka",
    "Resolute Racoon",
    "Savvy Squirrel",
    "Tenacious Tiger",
    "Unbiased Urial",
    "Veracious Vervet",
    "Wise Wolf",
    "Xenial Xerus",
    "Youthful Yak",
    "Zealous Zebra"
]

export const Yjs: [
    state: YjsState,
    actions: YjsActions
] = createRoot(() => {
    const ydoc = new Y.Doc()
    const persistence = new IndexeddbPersistence('project', ydoc)
    const webrtcNoSignalling = new WebrtcProvider("browser-tabs", ydoc, { signaling: [] })

    const [searchParams, setSearchParams] = useSearchParams<YjsSearchParams>()
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
