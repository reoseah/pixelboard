import { makePersisted } from '@solid-primitives/storage'
import { createContext, createEffect, createRoot, createSignal, onCleanup, useContext } from 'solid-js'
import { WebrtcProvider } from 'y-webrtc'

import useSearchParams from '../hooks/useSearchParams'
import YjsContext from './YjsContext'


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


export const YWebrtcState = createRoot(() => {
  const yjs = useContext(YjsContext)

  const [provider, setProvider] = createSignal<undefined | WebrtcProvider>(undefined)

  const [searchParams, setSearchParams] = useSearchParams<YjsSearchParams>()
  const [userName, setUserNameInternal] = makePersisted(createSignal<string>(userNamePool[Math.floor(Math.random() * userNamePool.length)]), { name: 'collaboration-username' })

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
    const webrtc = provider()
    if (webrtc) {
      webrtc.awareness.setLocalStateField('user', { name })
    }
  }

  createEffect(() => {
    const room = searchParams.room
    const ydoc = yjs.ydoc()

    if (!room) {
      provider()?.disconnect()
      provider()?.destroy()
      return
    }

    provider()?.disconnect()
    provider()?.destroy()

    setProvider(new WebrtcProvider(room, ydoc, {
      filterBcConns: true,
    }))

    if (userName().trim() === '') {
      setUserName(userNamePool[Math.floor(Math.random() * userNamePool.length)])
    }
    provider()!.awareness.setLocalStateField('user', {
      name: userName(),
    })
    provider()!.connect()
  })

  onCleanup(() => {
    provider()?.disconnect()
    provider()?.destroy()
  })

  return {
    endSession,
    startSession,

    setUserName,
    userName,

    getShareUrl,
    room: () => searchParams.room || '',
    setRoom: (room: string) => setSearchParams({ room }),
  }
})

export const YWebrtcContext = createContext(YWebrtcState)

export default YWebrtcContext
