import { makePersisted } from '@solid-primitives/storage'
import { Accessor, createContext, createEffect, createRoot, createSignal, onCleanup } from 'solid-js'
import { IndexeddbPersistence } from 'y-indexeddb'
import { WebrtcProvider } from 'y-webrtc'
import * as Y from 'yjs'

import useSearchParams from '../hooks/useSearchParams'

export type YjsState = {
  deserialize: (data: Uint8Array) => void
  endSession: () => void
  getShareUrl: () => string | undefined

  persistence: IndexeddbPersistence
  room: Accessor<null | string>
  serialize: () => Promise<Uint8Array>

  setUserName: (name: string) => void
  startSession: () => void
  userName: Accessor<string | undefined>
  webrtcNoSignalling: WebrtcProvider
  webrtcProvider: () => undefined | WebrtcProvider
  ydoc: Y.Doc
}

type YjsSearchParams = {
  room?: string
}

const userNamePool = [
  'Authentic Anthelope',
  'Brave Bear',
  'Curious Cat',
  'Daring Dog',
  'Energetic Elephant',
  'Fearless Fox',
  'Generous Gazelle',
  'Humble Hamster',
  'Inquisitive Iguana',
  'Jolly Jaguar',
  'Keen Kangaroo',
  'Leisurely Lemur',
  'Magnetic Mongoose',
  'Nimble Newt',
  'Omniscient Ocelot',
  'Playful Panda',
  'Quick Quokka',
  'Resolute Racoon',
  'Savvy Squirrel',
  'Tenacious Tiger',
  'Unbiased Urial',
  'Veracious Vervet',
  'Wise Wolf',
  'Xenial Xerus',
  'Youthful Yak',
  'Zealous Zebra',
]

export const Yjs: YjsState = createRoot(() => {
  const ydoc = new Y.Doc()
  const persistence = new IndexeddbPersistence('project', ydoc)
  const webrtcNoSignalling = new WebrtcProvider('browser-tabs', ydoc, { signaling: [] })

  const [searchParams, setSearchParams] = useSearchParams<YjsSearchParams>()
  const [userName, setUserNameInternal] = makePersisted(createSignal<string>(userNamePool[Math.floor(Math.random() * userNamePool.length)]), { name: 'collaboration-username' })
  let webrtcProvider: undefined | WebrtcProvider = undefined

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

  const setUserName = (name: string) => {
    setUserNameInternal(name)
    if (webrtcProvider) {
      webrtcProvider.awareness.setLocalStateField('user', {
        name,
      })
    }
  }

  const serialize = async () => {
    console.log('Serialized', JSON.stringify(ydoc.toJSON()))
    return Y.encodeStateAsUpdate(ydoc)
  }

  const deserialize = (data: Uint8Array) => {
    console.log('Deserializing', JSON.stringify(ydoc.toJSON()))
    ydoc.transact(() => {
      Y.applyUpdate(ydoc, data)
    })
    console.log('Deserialized', JSON.stringify(ydoc.toJSON()))
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
      name: userName(),
    })
    webrtcProvider.connect()
  })

  onCleanup(() => {
    webrtcProvider?.disconnect()
    webrtcProvider?.destroy()
  })

  return {
    deserialize,
    endSession,
    getShareUrl,
    persistence,
    room: () => searchParams.room || '',
    serialize,

    setUserName,
    startSession,
    userName,
    webrtcNoSignalling,
    webrtcProvider: () => webrtcProvider,
    ydoc,
  }
})

export const YjsContext = createContext(Yjs)

export default YjsContext
