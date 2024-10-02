import { Accessor, createContext, createEffect, createRoot, createSignal } from 'solid-js'
import { IndexeddbPersistence } from 'y-indexeddb'
import { WebrtcProvider } from 'y-webrtc'
import * as Y from 'yjs'

export type YjsState = {
  ydoc: Accessor<Y.Doc>

  deserialize: (data: Uint8Array) => void
  serialize: () => Promise<Uint8Array>
}

export const Yjs: YjsState = createRoot(() => {
  const [ydoc, ] = createSignal(new Y.Doc())

  createEffect<{ destroy: () => void }[]>((prev) => {
    if (prev) {
      prev[0].destroy()
      prev[1].destroy()
    }

    const indexeddbPersistence = new IndexeddbPersistence('project', ydoc())
    const webrtcProvider = new WebrtcProvider('browser-tabs', ydoc(), { signaling: [] })

    return [indexeddbPersistence, webrtcProvider]
  })

  const serialize = async () => {
    console.log('Serialized', JSON.stringify(ydoc().toJSON()))
    return new TextEncoder().encode(JSON.stringify(ydoc().toJSON()))
  }

  const deserialize = (data: Uint8Array) => {
    console.log('Before deserializing', JSON.stringify(ydoc().toJSON()))

    const json = JSON.parse(new TextDecoder().decode(data))
    console.log('JSON', json)

    ydoc().transact(() => {
      ydoc().share.forEach((ytype, key) => {
        if (ytype instanceof Y.Array) {
          const array = ydoc().getArray(key)
          array.delete(0, array.length)
          array.insert(0, json[key])
        } else if (ytype instanceof Y.Map) {
          const map = ydoc().getMap(key)
          map.clear()
          Object.entries(json[key]).forEach(([k, v]) => map.set(k, v))
        }
      })
    })

    console.log('After deserializing', JSON.stringify(ydoc().toJSON()))
  }

  return {
    ydoc,

    deserialize,
    serialize,
  }
})

export const YjsContext = createContext(Yjs)

export default YjsContext
