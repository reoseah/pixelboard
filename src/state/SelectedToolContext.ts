import { makePersisted } from '@solid-primitives/storage'
import { Accessor, createContext, createSignal } from 'solid-js'

export type SelectedTool = {
  id: Accessor<string>
  prevId: Accessor<string>
  selectId: (id: string) => void
}

const SelectedToolContext = createContext<SelectedTool>(undefined as unknown as SelectedTool)

export default SelectedToolContext

export const createSelectedTool = (): SelectedTool => {
  const [id, setId] = makePersisted(createSignal('select'), { name: 'selected-tool' })
  const [prevId, setPrevId] = createSignal('select')

  // It feels strange to open the app and see command palette,
  // the intuition is that command palette being opened should
  // be ephemeral and not persist
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
}
