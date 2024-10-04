import { makePersisted } from '@solid-primitives/storage'
import { Accessor, createContext, createEffect, createSignal, onCleanup } from 'solid-js'
import { WebrtcProvider } from 'y-webrtc'
import * as Y from 'yjs'

import useSearchParams from '../hooks/useSearchParams'

export type YWebrtcState = {
  startSession: () => void
  endSession: () => void

  userName: Accessor<string>
  setUserName: (name: string) => void

  room: Accessor<string>
  getShareUrl: () => string | undefined
  setRoom: (room: string) => void
}

export const YWebrtcContext = createContext<YWebrtcState>(undefined as unknown as YWebrtcState)

export default YWebrtcContext

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
  'Observant Ocelot',
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

const chooseUserName = () => userNamePool[Math.floor(Math.random() * userNamePool.length)]

export const createYWebrtcState = (ydoc: Y.Doc) => {
  const [searchParams, setSearchParams] = useSearchParams<YjsSearchParams>()
  const [userName, setUserNameInternal] = makePersisted(createSignal<string>(chooseUserName()), { name: 'collaboration-username' })
  const [provider, setProviderInternal] = createSignal<undefined | WebrtcProvider>(undefined)

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
    if (name.trim() === '') {
      name = chooseUserName()
    }

    setUserNameInternal(name)
    const webrtc = provider()
    if (webrtc) {
      webrtc.awareness.setLocalStateField('user', { name })
    }
  }

  const setProvider = (provider: WebrtcProvider | undefined) => {
    setProviderInternal((prev) => {
      if (prev) {
        prev.disconnect()
        prev.destroy()
      }
      if (provider) {
        provider.connect()
      }
      return provider
    })
  }

  createEffect(() => {
    const room = searchParams.room

    if (room) {
      const provider = new WebrtcProvider(room, ydoc, {
        filterBcConns: true,
      })
      provider.awareness.setLocalStateField('user', {
        name: userName(),
      })
      setProvider(provider)
    }
    else {
      setProvider(undefined)
    }
  })

  onCleanup(() => {
    provider()?.disconnect()
    provider()?.destroy()
  })

  return {
    startSession,
    endSession,

    userName,
    setUserName,

    room: () => searchParams.room || '',
    getShareUrl,
    setRoom: (room: string) => setSearchParams({ room }),
  }
}
