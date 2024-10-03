import { makePersisted } from '@solid-primitives/storage'
import { createSignal } from 'solid-js'

const [id, setId] = makePersisted(createSignal('select'), { name: 'selected-tool' })
const [prevId, setPrevId] = createSignal('select')

// It feels strange to open page and see command palette there,
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

export default {
  id,
  prevId,
  selectId,
}