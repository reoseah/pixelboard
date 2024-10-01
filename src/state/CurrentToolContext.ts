import { makePersisted } from '@solid-primitives/storage'
import { Accessor, createContext, createRoot, createSignal } from 'solid-js'

export type CurrentTool = {
  id: Accessor<string>
  prevId: Accessor<string>
  selectId: (id: string) => void
}

export const CurrentTool: CurrentTool = createRoot(() => {
  const [id, setId] = makePersisted(createSignal('select'), { name: 'selected-tool' })
  const [prevId, setPrevId] = createSignal('select')

  if (id() === 'command_palette') {
    setId('select')
  }

  const selectId = (targetId: string) => {
    const prevId = id()
    if (prevId === targetId) {
      return
    }

    setId(targetId)
    setPrevId(prevId)
  }

  return {
    id,
    prevId,
    selectId,
  }
})

export const CurrentToolContext = createContext(CurrentTool)

export default CurrentToolContext
