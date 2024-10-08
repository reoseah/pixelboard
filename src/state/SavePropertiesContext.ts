import { makePersisted } from '@solid-primitives/storage'
import { Accessor, createContext, createSignal } from 'solid-js'

export const formats = [
  { label: 'PNG', value: 'image/png' },
  // { value: "image/jpeg", label: "JPEG" },
  { label: 'WebP', value: 'image/webp' },
]

export type SaveProperties = {
  scale: Accessor<number>
  setScale: (scale: number) => void

  format: Accessor<string>
  setFormat: (format: string) => void
}

const SavePropertiesContext = createContext<SaveProperties>(undefined as unknown as SaveProperties)

export default SavePropertiesContext

export const createSaveProperties = (): SaveProperties => {
  const [scale, setScale] = makePersisted(createSignal(1), { name: 'save-scale' })
  const [format, setFormat] = makePersisted(createSignal('image/png'), { name: 'save-format' })

  return {
    scale,
    setScale,
    format,
    setFormat,
  }
}
