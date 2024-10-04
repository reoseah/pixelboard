import { createContext } from 'solid-js'
import { IndexeddbPersistence } from 'y-indexeddb'
import { WebrtcProvider } from 'y-webrtc'
import * as Y from 'yjs'

export type YjsState = {
  ydoc: Y.Doc

  deserialize: (data: Uint8Array) => void
  serialize: () => Promise<Uint8Array>
  clear: () => void
}

const YjsContext = createContext<YjsState>(undefined as unknown as YjsState)

export default YjsContext

export const createYjsState = (): YjsState => {
  const ydoc = new Y.Doc()

  new WebrtcProvider('browser-tabs', ydoc, { signaling: [] })
  const indexeddbPersistence = new IndexeddbPersistence('project', ydoc)

  const serialize = async () => {
    return new TextEncoder().encode(JSON.stringify(ydoc.toJSON()))
  }

  const deserialize = (data: Uint8Array) => {
    const json = JSON.parse(new TextDecoder().decode(data))

    indexeddbPersistence.clearData()
    ydoc.transact(() => {
      ydoc.share.forEach((ytype, key) => {
        if (ytype instanceof Y.Array) {
          const yarray = ydoc.getArray(key)
          yarray.delete(0, yarray.length)
          yarray.insert(0, json[key])
        }
        else if (ytype instanceof Y.Map) {
          const ymap = ydoc.getMap(key)
          ymap.clear()
          Object.entries(json[key]).forEach(([k, v]) => ymap.set(k, v))
        }
      })
    })
  }

  const clear = () => {
    indexeddbPersistence.clearData()
    ydoc.transact(() => {
      ydoc.share.forEach((ytype, key) => {
        if (ytype instanceof Y.Array) {
          const yarray = ydoc.getArray(key)
          yarray.delete(0, yarray.length)
        }
        else if (ytype instanceof Y.Map) {
          const ymap = ydoc.getMap(key)
          ymap.clear()
        }
      })
    })
  }

  return {
    ydoc,

    deserialize,
    serialize,
    clear,
  }
}
